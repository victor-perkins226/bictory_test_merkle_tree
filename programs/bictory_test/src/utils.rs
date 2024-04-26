use anchor_lang::prelude::msg;
use crate::account::*;

pub fn generate_new_root(state: &mut State, new_leaf: [u8; 32]) {
    
    let min_proofs = state.min_proofs.clone();
    let last_leaf = state.last_leaf;
    let leaf_count = state.leaf_count;

    let mut cur_hash = new_leaf; 

    if leaf_count == 0 {
        state.merkle_root = cur_hash;
        state.leaf_count += 1;
        state.last_leaf = Some(new_leaf);
    }
    else {
        // calculate new hash in level1
        match last_leaf {
            // calculate new hash with last leaf and new leaf when last leaf exists
            Some(leaf) => {
                cur_hash = anchor_lang::solana_program::keccak::hashv(&[&leaf, &new_leaf]).0;
                state.last_leaf = None;
            }
            // calculate new hash with new leaf and new leaf when last leaf doesn't exist
            None => {
                msg!("none");
                cur_hash = new_leaf;
                state.last_leaf = Some(new_leaf);
            }
        }
        msg!("last_leaf: {:?} cur_hash: {:?}", last_leaf, cur_hash);
        // calculate new min_proofs
        let mut cur_level = 1;
        let mut new_min_proofs: Vec<Proof> = Vec::<Proof>::new();

        for proof in min_proofs.into_iter() {
            while cur_level < proof.level {
                msg!("cur_level {:?} cur_hash {:?}", cur_level, cur_hash);
                // cur_hash = anchor_lang::solana_program::keccak::hash(&cur_hash).0;
                cur_level += 1;
                // msg!("modified cur_hash {:?}", cur_hash);
            }

            //sort pairs
            if proof.hash <= cur_hash {
                cur_hash = anchor_lang::solana_program::keccak::hashv(&[&proof.hash, &cur_hash]).0;
            }
            else {
                cur_hash = anchor_lang::solana_program::keccak::hashv(&[&cur_hash, &proof.hash]).0;
            }
            new_min_proofs.push(proof.clone());
            cur_level += 1;
        }
        state.merkle_root = cur_hash;
        state.leaf_count += 1;

        let level = (state.leaf_count as f32).log2();
        msg!("level : {:?}", level);
        let proof: Proof = Proof { hash: state.merkle_root, level: level.floor() as u8 };

        // if leaf_count == 2 ^ level => clear min proofs
        if level - level.floor() == 0.0 {
            new_min_proofs.clear();
            new_min_proofs.push(proof);
        }

        state.min_proofs = new_min_proofs;
    }
    
    msg!("new state root {:?} min_proofs: {:?} last_leaf: {:?}, leaf_count: {:?}", state.merkle_root, state.min_proofs, state.last_leaf, state.leaf_count);
}

pub fn verify(proof: Vec<[u8; 32]>, root: [u8; 32], leaf: [u8; 32]) -> bool {
    let mut computed_hash = leaf;
    for proof_element in proof.into_iter() {
        if computed_hash <= proof_element {
            // Hash(current computed hash + current element of the proof)
            computed_hash =
                anchor_lang::solana_program::keccak::hashv(&[&computed_hash, &proof_element]).0;
        } else {
            // Hash(current element of the proof + current computed hash)
            computed_hash =
                anchor_lang::solana_program::keccak::hashv(&[&proof_element, &computed_hash]).0;
        }
    }
    // Check if the computed hash (root) is equal to the provided root
    computed_hash == root
}

