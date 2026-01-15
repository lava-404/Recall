import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Anchor } from "..target/types/anchor";
import { PublicKey } from "@solana/web3.js"
describe("anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.anchor as Program<Anchor>;
  const provider = anchor.getProvider();
  const signerPubkey = provider.wallet.publicKey;

  const title = "Intro!";
    const [pda, _] = PublicKey.findProgramAddressSync([
      Buffer.from(title), signerPubkey.toBuffer()
    ], program.programId)

  it("Create Entry", async () => {
    // Add your test here.
    
    

    const message = "Merry Christmas fam!";
    const tx = await program.methods.createEntry(title, message).rpc({commitment: "confirmed"});

    const note_account = await program.account.note.fetch(pda, "confirmed");

    console.log(JSON.stringify(note_account, null, 2));
    console.log("See your message account here: ",`https://solana.fm/tx/${tx}?cluster=devnet-solana`)
    console.log("Your transaction signature", tx);
  });

  it("Update Entry", async() => {
    const message = "Merry Christmas fam! Hehe and happy new year!";
    const tx = await program.methods.updateEntry(title, message).rpc({commitment: "confirmed"});
    const note_account = await program.account.note.fetch(pda, "confirmed");
    console.log(JSON.stringify(note_account, null, 2));
    console.log("See your message account here: ",`https://solana.fm/tx/${tx}?cluster=devnet-solana`)
    console.log("Your transaction signature", tx);
  });

  it("Delete Entry", async() => {
    const message = "Merry Christmas fam! Hehe and happy new year!";
    const tx = await program.methods.deleteEntry(title).rpc({commitment: "confirmed"});
    console.log("See your message account here: ",`https://solana.fm/tx/${tx}?cluster=devnet-solana`)
    console.log("Your transaction signature", tx);
  });


});
