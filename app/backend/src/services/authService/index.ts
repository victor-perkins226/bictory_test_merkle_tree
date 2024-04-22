import { PublicKey } from "@solana/web3.js"
import * as anchor from "@project-serum/anchor";

import bs58 from 'bs58';
import nacl from 'tweetnacl';
import CONFIG from "../../config";
const { SIGN_KEY } = CONFIG;

const verify = async (address: string, signature: string): Promise<boolean> => {
  try {
    if (PublicKey.isOnCurve(new anchor.web3.PublicKey(address).toBytes())) {
      console.log('address', address, 'signature', bs58.decode(signature));
      const verified = nacl.sign.detached.verify(new TextEncoder().encode(SIGN_KEY), bs58.decode(signature), new anchor.web3.PublicKey(address).toBuffer());
      console.log('verified', verified)
      return !!verified;
    }
  }
  catch (err) {
    console.log(`wallet address validation err:`, err);
  }

  return false;
}


export default {
  verify
}