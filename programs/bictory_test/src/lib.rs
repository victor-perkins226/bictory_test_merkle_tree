use anchor_lang::prelude::*;
declare_id!("ECVESb2kpEyN3WoQU1ZvVt51SjBa2wUccZJ5PGJcoqHr");

pub mod contexts;
pub mod account;
pub mod constants;
pub mod errors;
pub mod utils;

use contexts::*;
use constants::*;
use errors::*;
use utils::*;

#[program]
pub mod bictory_test {
    use super::*;

    pub fn add_to_whitelist(ctx: Context<AddToWhitelist>, new_merkle_root: [u8; 32]) -> Result<()> {

        let state = &mut ctx.accounts.state;

        // Ensure sender is admin
        require_eq!(ctx.accounts.admin.key, &ADMIN_KEY, ErrorCodes::NotAdmin);

        state.merkle_root = new_merkle_root;

        Ok(())
    }

    pub fn target(ctx: Context<Target>, proof: Vec<[u8; 32]>) -> Result<()> {
        let sender = ctx.accounts.sender.key();
        let root = ctx.accounts.state.merkle_root;
        let node = anchor_lang::solana_program::keccak::hash(sender.key().as_ref());

        require!(verify(proof, root, node.0), ErrorCodes::NotWhiteList);
        msg!(&format!("{} 👍 {}", WHITELIST_MSG, sender.key()));

        Ok(())
    }
}
