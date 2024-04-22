import { PublicKey, getMerkleProof, getMerkleRoot } from '@metaplex-foundation/js';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { WalletContextState } from '@solana/wallet-adapter-react';

export const getWhiteLists = async () => {
    const { data } = await axios.get(`${BACKEND_URL}/api/merkle/whitelist`);
    return data;
}

export const addWhiteList = async (newAddress: string, signature: string) => {
    const { data } = await axios.post(`${BACKEND_URL}/api/merkle/whitelist`, {
        newAddress,
        signature
    });

    return data;
}

export const getRoot = async (addresses: PublicKey[]) => {
    const whitelistedBuffer = addresses.map((address) =>
        address.toBuffer()
    );

    const root = await getMerkleRoot(whitelistedBuffer);
    return root
}

export const getProof = async (addresses: PublicKey[], leaf: PublicKey) => {
    const whitelistedBuffer = addresses.map((address) =>
        address.toBuffer()
    );

    const proof = getMerkleProof(whitelistedBuffer, leaf.toBuffer());
    return proof;
}

export const getSignedMessage = async (wallet: WalletContextState, message: string) => {
    try {
      if (!wallet.publicKey) return null;
      const signedMessage = await wallet.signMessage!(new TextEncoder().encode(message));
      return signedMessage;
    }
    catch (error) {
      console.log('error', error)
      return null;
    }
  }