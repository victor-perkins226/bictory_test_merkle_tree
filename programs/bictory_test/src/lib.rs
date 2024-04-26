use anchor_lang::prelude::*;

declare_id!("C5Z6zKYG7RFezSuijQVEXexAbDJsb8jfVaxF7a6rP3Dj");

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

    pub fn add_to_whitelist(ctx: Context<AddToWhitelist>, new_address: [u8; 32]) -> Result<()> {
        // Ensure sender is admin
        require_eq!(ctx.accounts.admin.key, &ADMIN_KEY, ErrorCodes::NotAdmin);
        let hash = anchor_lang::solana_program::keccak::hash(&new_address).0;
        msg!("hash {:?}", hash);
        generate_new_root(&mut ctx.accounts.state, hash);

        Ok(())
    }

    pub fn target(ctx: Context<Target>, proofs: Vec<[u8;32]>) -> Result<()> {
        let sender = ctx.accounts.sender.key();
        let root = ctx.accounts.state.merkle_root;
        // let state = &ctx.accounts.state;
        let node = anchor_lang::solana_program::keccak::hash(sender.key().as_ref());
        require!(verify(proofs.clone(), root, node.0), ErrorCodes::NotWhiteList);
        msg!(&format!("{} 👍 {}", WHITELIST_MSG, sender.key()));

        Ok(())
    }
}
