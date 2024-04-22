import React, { FC, useCallback, useEffect, useState } from 'react';
require('@solana/wallet-adapter-react-ui/styles.css');

import './App.css';

import { Context } from './components/WalletConnection/WalletConnection';
import { BioElement } from './components/BioElement/BioElement';;
import {NavAppBar} from './components/Navbar/Navbar';
import githubLogo from './assets/github-logo.svg';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Merkle } from './components/Merkle/Merkle';
const HANDLE = ['https://github.com/victor-perkins226/bictory_test_merkle_tree'];
const LOGO = [githubLogo];

export const App: FC = () => {
    const [walleState, setWalletState] = useState(0);

    const handleConnected = (walletState: number) => {
        setWalletState(walletState);
    }

    return (
        <div>
            <Context>
                <div className='navbar-position'>        {/* className='navbar-position' */}
                    <NavAppBar  
                        onChangeWalletState={handleConnected}
                    />
                </div>
    
                <div className="base-app-text">
                    <Merkle walletState={walleState} />
                </div>
                <div id="qr-solanaPay"><p>Merkle Tree WhiteList</p></div>
                <div>
                    <BioElement logo={LOGO} link={HANDLE}></BioElement>
                </div>
            </Context>
            <ToastContainer />
        </div>
    );
};



// Built By Ujjwal Gupta https://twitter.com/UjjwalG52261234
