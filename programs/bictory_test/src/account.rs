use anchor_lang::prelude::*;

#[account]
pub struct State {
    pub merkle_root: [u8; 32], // current merkle root
    pub min_proofs: Vec<Proof>, // min proofs enough to calculate new root when appending one
    pub last_leaf: Option<[u8; 32]>, // lasted appended leaf
    pub leaf_count: u32, // count of total appended leaves
}

#[derive(Default, Debug, AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Proof {
    pub hash: [u8; 32],
    pub level: u8 // level of  proof
}
