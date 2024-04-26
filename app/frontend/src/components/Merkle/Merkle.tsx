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
import { addWhiteList, generate, getProof, getRoot, getSignedMessage, getWhiteLists } from "../../helpers";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import {Keccak} from "sha3";

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
        const root = getRoot([...whiteLists, address].map(address => new PublicKey(address)));
        console.log('root', root);
        const proof = getProof([...whiteLists, address].map(address => new PublicKey(address)), new PublicKey(address));
        console.log('proof', proof);
        let [state]: any = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(ROOT_SEED)],
            new PublicKey(PROGRAM_ID)
        );

        const builder = program.methods.addToWhitelist(new PublicKey(address).toBuffer());
        try {
            const tx = await builder.accounts({
                admin: anchorWallet?.publicKey,
                state: state,
                systemProgram: SystemProgram.programId
            }).rpc();
            console.log('tx', tx);

            setWhiteLists([...whiteLists, address]);

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

        /* For test */

        // const hashFn = new Keccak(256);
        // const hashFn2 = new Keccak(256);
        // const hashFn3 = new Keccak(256);
        // const buffer1 = new Buffer([57, 116, 137, 49, 221, 143, 100, 217, 112, 133, 44, 107, 147, 178, 56, 19, 57, 205, 157, 145, 159, 242, 112, 242, 220, 44, 129, 42, 99, 132, 124, 238] );
        // const ___buffer2 = new PublicKey("DuQYWijgfS2wsymACUphE6RexkWiN5HfMQq5YPrcTXTw").toBuffer();
        // // const __buffer2 = hashFn.update(new PublicKey("EM9Q8UCY7cCcX3h2wA1r8Zx6ZRJW9KEz2qvmykjZb1e8").toBuffer()).digest({ buffer: Buffer.alloc(32), format: 'hex' });
        // const _buffer2 = hashFn.update(Buffer.concat([___buffer2]))
        // .digest({ buffer: Buffer.alloc(32), format: 'hex' });
        // const buffer2 = Buffer.from(_buffer2, 'hex');
        // console.log('buffer2', buffer2);

        // const buffer22_ = hashFn.update(Buffer.concat([buffer2]))
        // .digest({ buffer: Buffer.alloc(32), format: 'hex' });
        // const buffer22 = Buffer.from(buffer22_);
        // console.log('bufer22', buffer22);
        // const buffer3 = hashFn2.update(Buffer.concat([buffer1, buffer2])).digest({ buffer: Buffer.alloc(32), format: 'hex' });
        // console.log('buffer3', Buffer.from(buffer3, 'hex'));
        // const root = getRoot(whiteLists.map(address => new PublicKey(address)));
        // console.log('root', root);
        // const proof = getProof(whiteLists.map(address => new PublicKey(address)), new PublicKey("ARni1LvjQGbn4K2qDSWdYD2Xvs8Z52SG16oyjkPcmdFc"));
        // console.log('proof', proof);
    }

    const handleTarget = async ()  => {
        const provider = new anchor.AnchorProvider(new Connection(RPC_URL), anchorWallet!, 'finalized' as anchor.web3.ConfirmOptions);
        const program = new anchor.Program(IDL as any, new PublicKey(PROGRAM_ID), provider);
    //     console.log('provider', provider);
        const proof = await getProof(whiteLists.map(address => new PublicKey(address)), wallet.publicKey!);
        console.log('proof', proof);
        // const minProof = generate(whiteLists.map(address => new PublicKey(address)));
        // console.log('minProof', minProof);
    //     console.log('methods', program.methods);
        let [state]: any = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(ROOT_SEED)],
            new PublicKey(PROGRAM_ID)
        );

        const builder = program.methods.target(proof);
        console.log('builder', builder);
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
