import React, { FC, useEffect } from "react";
import { useCallback, useState } from "react";
import * as anchor from '@project-serum/anchor';
import base58 from 'bs58'
import { ToastContainer, toast } from 'react-toastify'
import { Target } from "../Target/Target";
import { AddWhiteList } from "../AddWhiteList/AddWhiteList";
import IDL from "../../config/idl.json";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { PROGRAM_ID, ROOT_SEED, RPC_URL, SIGN_KEY } from "../../config";
import { addWhiteList, getProof, getRoot, getSignedMessage, getWhiteLists } from "../../helpers";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";

interface MerkleProps {
    walletState: number
}

export const Merkle: FC<MerkleProps> = (props) => {
    const { walletState } = props;
    const [ whiteLists, setWhiteLists ] = useState<string[]>([]);
    const wallet = useWallet();
    const anchorWallet = useAnchorWallet();
    const getData = useCallback(async () => {
        const data = await getWhiteLists();
        console.log('data', data);
        if (data) {
            setWhiteLists(data);
        }
    }, [anchorWallet?.publicKey]);

    const handleAddWhiteList = async (address: string) => {
        const provider = new anchor.AnchorProvider(new Connection(RPC_URL), anchorWallet!, 'finalized' as anchor.web3.ConfirmOptions);
        const program = new anchor.Program(IDL as any, new PublicKey(PROGRAM_ID), provider);
        console.log('provider', provider);
        const root = await getRoot([...whiteLists, address].map(address => new PublicKey(address)));
        console.log('root', root);
        console.log('methods', program.methods);
        let [state]: any = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(ROOT_SEED)],
            new PublicKey(PROGRAM_ID)
        );

        const builder = program.methods.addToWhitelist(root);
        try {
            const tx = await builder.accounts({
                admin: anchorWallet?.publicKey,
                state: state,
                systemProgram: SystemProgram.programId
            }).rpc();
            console.log('tx', tx);

            const signature = await getSignedMessage(wallet!, SIGN_KEY);
            if (signature) {
                const result = await addWhiteList(address, base58.encode(signature));
                if (result) {
                    setWhiteLists([...whiteLists, address]);
                    toast.success(`Success on adding whitelist for ${address}`);
                }
                console.log('result', result);
            }
        }
        catch (error) {
            toast.error(`Fail on adding whitelist for ${address}`);
            console.log('error', error);
        }
    }

    const handleTarget = async ()  => {
        const provider = new anchor.AnchorProvider(new Connection(RPC_URL), anchorWallet!, 'finalized' as anchor.web3.ConfirmOptions);
        const program = new anchor.Program(IDL as any, new PublicKey(PROGRAM_ID), provider);
        console.log('provider', provider);
        const proof = await getProof(whiteLists.map(address => new PublicKey(address)), wallet.publicKey!);
        console.log('proof', proof);
        console.log('methods', program.methods);
        let [state]: any = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(ROOT_SEED)],
            new PublicKey(PROGRAM_ID)
        );

        const builder = program.methods.target(proof);
        try {
            const tx = await builder.accounts({
                sender: anchorWallet?.publicKey,
                state: state
            }).rpc();
            console.log('tx', tx);
            toast.success(`Success on targeting for ${wallet.publicKey?.toString()}`);
        }
        catch (error) {
            console.log('error', error);
            toast.error(`Fail on targeting for ${wallet.publicKey?.toString()}`);
        }
        
    }

    useEffect(() => {
        getData();
    }, [getData, anchorWallet?.publicKey]);

    return (
        <div>
            {
                walletState > 0 ? (walletState == 2 ? 
                <AddWhiteList onAddWhiteList={handleAddWhiteList} /> :
                 <Target onTarget={handleTarget}/> )
                : <h1>Solana-Bictory-Test 🔥 </h1> 
            }
            <ToastContainer />
        </div>
    );
};
