use anchor_lang::prelude::*;

declare_id!("ECVESb2kpEyN3WoQU1ZvVt51SjBa2wUccZJ5PGJcoqHr");

#[program]
pub mod bictory_test {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
