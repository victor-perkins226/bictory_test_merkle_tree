use anchor_lang::prelude::*;
use std::mem::size_of;
use crate::account::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct AddToWhitelist<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(init_if_needed, seeds = [
        ROOT_SEED.as_bytes()], 
        bump, 
        payer = admin, 
        space = size_of::<State>() + 8
      )]
    pub state: Account<'info, State>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Target<'info> {
  pub sender: Signer<'info>,
  pub state: Account<'info, State>,
}