use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCodes {
    #[msg("You are not admin")]
    NotAdmin,
    #[msg("You are not whitelist")]
    NotWhiteList,
}