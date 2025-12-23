import { Connection, Transaction } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import idl from "@/idl/anchor.json";
import type { Anchor } from "../../../anchor/target/types/anchor";

export async function POST(req: Request) {
  const { title, message } = await req.json();

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  // ✅ Dummy provider (server does NOT sign)
  const provider = new AnchorProvider(
    connection,
    {} as any,
    { commitment: "confirmed" }
  );

  const program = new Program(idl as Anchor, provider);

  // ✅ Build instruction (not send)
  const instruction = await program.methods
    .createEntry(title, message)
    .instruction();

  // ✅ Build transaction shell
  const transaction = new Transaction().add(instruction);

  return Response.json({
    transaction: transaction.serialize({ requireAllSignatures: false }).toString("base64"),
  });
}
