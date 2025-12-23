use anchor_lang::prelude::*;

declare_id!("HUbXt9FnYeeWLEJqdbuMZMTYSQm6MoFxaECo4ywASjCp");

#[program]
pub mod anchor {
    use super::*;

    pub fn create_entry(ctx: Context<CreateEntry>, title: String, message: String) -> Result<()> {
        let note = &mut ctx.accounts.note_account;
        note.owner = ctx.accounts.signer.key();
        note.title = title;
        note.message = message;

        Ok(())
    }

    pub fn update_entry(ctx: Context<UpdateEntry>, _title: String, message: String) -> Result<()> {
        let note = &mut ctx.accounts.note_account;
        note.message = message;
        Ok(())
    }

    pub fn delete_entry(_ctx: Context<UpdateEntry>, _title: String) -> Result<()> {
        
        Ok(())
    }


}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        seeds = [title.as_bytes(), signer.key().as_ref()],
        bump,
        space = 8 + Note::INIT_SPACE
    )]
    pub note_account: Account<'info, Note>,
    pub system_program: Program<'info, System>
}


#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [title.as_bytes(), signer.key().as_ref()],
        bump,
        realloc = 8 + Note::INIT_SPACE,
        realloc::payer = signer,
        realloc::zero = true

    )]
    pub note_account: Account<'info, Note>,
    pub system_program: Program<'info, System>
}


#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [title.as_bytes(), signer.key().as_ref()],
        bump,
        close = signer

    )]
    pub note_account: Account<'info, Note>,
    pub system_program: Program<'info, System>
}

#[account]
#[derive(InitSpace)]
pub struct Note {
    pub owner: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(280)]
    pub message: String,

}
