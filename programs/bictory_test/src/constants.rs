use anchor_lang::prelude::Pubkey;

pub const ROOT_SEED: &str = "merkle tree";
pub const ADMIN_KEY: Pubkey = anchor_lang::solana_program::pubkey!("3ttYrBAp5D2sTG2gaBjg8EtrZecqBQSBuFRhsqHWPYxX"); 
pub const WHITELIST_MSG: &str = "You're whitelist";
pub const ENOUGH_LEVEL: usize = 20; // it can contains 1024 * 1024 leaves