use anchor_lang::prelude::*;

#[account]
pub struct State {
    pub merkle_root: [u8; 32]
}
