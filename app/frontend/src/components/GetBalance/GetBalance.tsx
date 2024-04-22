import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletError, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, { useCallback, FC, useState, useEffect } from 'react';
import './GetBalance.css';
import { Button } from '@mui/material';
import { ADMIN_ADDRESS } from '../../config';

interface GetBalanceProps {
    onChangeWalletState: Function
}

export const GetBalance: FC<GetBalanceProps> = (props) => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [checkAmount, setAmount] = useState(0);

    const checkBalance = useCallback(async () => {
        if (publicKey != null) {
            if (publicKey.toString() == ADMIN_ADDRESS) {
                props.onChangeWalletState(2);
            }
            else {
                props.onChangeWalletState(1);
            }

            const walletBalance = await connection.getBalance(publicKey, 'confirmed');
            const walletBalanceSOL = (walletBalance / LAMPORTS_PER_SOL).toFixed(2);
            setAmount(parseInt(walletBalanceSOL));
            console.log(walletBalanceSOL);
            console.log(publicKey);
        }
        else {
            console.log('⚠️ Wallet not connected')
            props.onChangeWalletState(0);
        }
    }, [connection, publicKey]);

    useEffect(() => {
        console.log('WalletBalance checked');
        checkBalance();
    }, [publicKey, checkBalance]);

    return (
        <Button onClick={checkBalance} variant= "text" ><p>{checkAmount} SOL</p></Button>
    );
};

