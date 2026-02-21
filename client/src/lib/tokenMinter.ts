/**
 * tokenMinter.ts — SPL Token Creation Utilities
 * Handles real on-chain token minting using @solana/spl-token
 * Flow: Fee payment → Token mint creation → Initial supply minting
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  TransactionInstruction,
} from '@solana/web3.js';

// SPL Token Program ID
const TOKEN_PROGRAM_ID_STR = 'TokenkegQfeZyiNwAJsyFbPVwwQQfsPB';
const SYSVAR_RENT_PUBKEY_STR = 'SysvarRent111111111111111111111111111111111';

export interface TokenConfig {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
  recipientAddress: string;
  revokeFreeze?: boolean;
  revokeMint?: boolean;
  revokeUpdate?: boolean;
}

export interface TokenCreationResult {
  mintAddress: string;
  tokenAccountAddress: string;
  transactionSignatures: string[];
  success: boolean;
  error?: string;
}

/**
 * Create instruction to initialize a mint account
 */
function createInitMintInstruction(
  mint: PublicKey,
  decimals: number,
  owner: PublicKey,
  freezeAuthority: PublicKey | null
): TransactionInstruction {
  const SYSVAR_RENT_PUBKEY = new PublicKey(SYSVAR_RENT_PUBKEY_STR);
  const keys = [
    { pubkey: mint, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  // Build data: instruction (1 byte) + decimals (1 byte) + owner (32 bytes) + freezeAuthority (33 bytes)
  const data = Buffer.alloc(1 + 1 + 32 + 33);
  data[0] = 0; // InitializeMint instruction
  data[1] = decimals;
  owner.toBuffer().copy(data, 2);
  
  if (freezeAuthority) {
    data[34] = 1; // Has freeze authority
    freezeAuthority.toBuffer().copy(data, 35);
  } else {
    data[34] = 0; // No freeze authority
  }

  return new TransactionInstruction({
    keys,
    programId: new PublicKey(TOKEN_PROGRAM_ID_STR),
    data,
  });
}

/**
 * Create instruction to initialize a token account
 */
function createInitTokenAccountInstruction(
  account: PublicKey,
  mint: PublicKey,
  owner: PublicKey
): TransactionInstruction {
  const SYSVAR_RENT_PUBKEY = new PublicKey(SYSVAR_RENT_PUBKEY_STR);
  const keys = [
    { pubkey: account, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  const data = Buffer.from([1]); // InitializeAccount instruction

  return new TransactionInstruction({
    keys,
    programId: new PublicKey(TOKEN_PROGRAM_ID_STR),
    data,
  });
}

/**
 * Create instruction to mint tokens
 */
function createMintToInstruction(
  mint: PublicKey,
  destination: PublicKey,
  authority: PublicKey,
  amount: bigint,
  decimals: number
): TransactionInstruction {
  const keys = [
    { pubkey: mint, isSigner: false, isWritable: true },
    { pubkey: destination, isSigner: false, isWritable: true },
    { pubkey: authority, isSigner: true, isWritable: false },
  ];

  // Build data: instruction (1 byte) + amount (8 bytes, little-endian)
  const data = Buffer.alloc(9);
  data[0] = 3; // MintTo instruction
  
  // Write amount as little-endian u64
  const amountBytes = new Uint8Array(8);
  const view = new DataView(amountBytes.buffer);
  view.setBigUint64(0, amount, true);
  Buffer.from(amountBytes).copy(data, 1);

  return new TransactionInstruction({
    keys,
    programId: new PublicKey(TOKEN_PROGRAM_ID_STR),
    data,
  });
}

/**
 * Create instruction to set authority (revoke)
 */
function createSetAuthorityInstruction(
  mint: PublicKey,
  authority: PublicKey,
  authorityType: number,
  newAuthority: PublicKey | null
): TransactionInstruction {
  const keys = [
    { pubkey: mint, isSigner: false, isWritable: true },
    { pubkey: authority, isSigner: true, isWritable: false },
  ];

  // Build data: instruction (1 byte) + authorityType (1 byte) + newAuthority (33 bytes)
  const data = Buffer.alloc(1 + 1 + 33);
  data[0] = 6; // SetAuthority instruction
  data[1] = authorityType;

  if (newAuthority) {
    data[2] = 1; // Has new authority
    newAuthority.toBuffer().copy(data, 3);
  } else {
    data[2] = 0; // Revoke (no new authority)
  }

  return new TransactionInstruction({
    keys,
    programId: new PublicKey(TOKEN_PROGRAM_ID_STR),
    data,
  });
}

/**
 * Create a new SPL token on Solana mainnet
 * Requires fee to already be paid
 */
export async function createSolanaToken(
  config: TokenConfig,
  walletPublicKey: string,
  signAndSendTransaction: (tx: Transaction) => Promise<{ signature: string }>
): Promise<TokenCreationResult> {
  try {
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const payer = new PublicKey(walletPublicKey);
    const recipient = new PublicKey(config.recipientAddress);

    // Generate keypairs for mint and token account
    const mintKeypair = Keypair.generate();
    const tokenAccountKeypair = Keypair.generate();
    const mintAddress = mintKeypair.publicKey;
    const tokenAccountAddress = tokenAccountKeypair.publicKey;

    console.log('Creating token mint:', mintAddress.toBase58());
    console.log('Token account:', tokenAccountAddress.toBase58());

    const signatures: string[] = [];

    // ===== TRANSACTION 1: Create mint account and initialize mint =====
    const createMintTx = new Transaction();

    // Create the mint account
    const rentExemptMint = await connection.getMinimumBalanceForRentExemption(82);
    createMintTx.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mintAddress,
        space: 82,
        lamports: rentExemptMint,
        programId: new PublicKey(TOKEN_PROGRAM_ID_STR),
      })
    );

    // Initialize the mint
    createMintTx.add(
      createInitMintInstruction(mintAddress, config.decimals, payer, payer)
    );

    createMintTx.feePayer = payer;
    createMintTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    createMintTx.partialSign(mintKeypair);

    const { signature: mintTxSig } = await signAndSendTransaction(createMintTx as any);
    signatures.push(mintTxSig);
    console.log('Mint creation tx:', mintTxSig);

    // Wait for confirmation
    await connection.confirmTransaction(mintTxSig, 'confirmed');

    // ===== TRANSACTION 2: Create token account and initialize it =====
    const createAccountTx = new Transaction();

    const rentExemptAccount = await connection.getMinimumBalanceForRentExemption(165);
    createAccountTx.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: tokenAccountAddress,
        space: 165,
        lamports: rentExemptAccount,
        programId: new PublicKey(TOKEN_PROGRAM_ID_STR),
      })
    );

    // Initialize the token account
    createAccountTx.add(
      createInitTokenAccountInstruction(tokenAccountAddress, mintAddress, recipient)
    );

    createAccountTx.feePayer = payer;
    createAccountTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    createAccountTx.partialSign(tokenAccountKeypair);

    const { signature: accountTxSig } = await signAndSendTransaction(createAccountTx as any);
    signatures.push(accountTxSig);
    console.log('Token account creation tx:', accountTxSig);

    await connection.confirmTransaction(accountTxSig, 'confirmed');

    // ===== TRANSACTION 3: Mint initial supply =====
    const mintTx = new Transaction();

    const initialSupply = BigInt(config.initialSupply) * BigInt(10 ** config.decimals);
    mintTx.add(
      createMintToInstruction(mintAddress, tokenAccountAddress, payer, initialSupply, config.decimals)
    );

    mintTx.feePayer = payer;
    mintTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const { signature: finalTxSig } = await signAndSendTransaction(mintTx as any);
    signatures.push(finalTxSig);
    console.log('Mint supply tx:', finalTxSig);

    await connection.confirmTransaction(finalTxSig, 'confirmed');

    // ===== TRANSACTION 4: Revoke authorities (if requested) =====
    if (config.revokeFreeze || config.revokeMint || config.revokeUpdate) {
      const revokeTx = new Transaction();

      // AuthorityType: MintTokens = 0, FreezeAccount = 1, Owner = 2
      if (config.revokeMint) {
        revokeTx.add(
          createSetAuthorityInstruction(mintAddress, payer, 0, null) // Revoke MintTokens
        );
      }

      if (config.revokeFreeze) {
        revokeTx.add(
          createSetAuthorityInstruction(mintAddress, payer, 1, null) // Revoke FreezeAccount
        );
      }

      if (config.revokeUpdate) {
        revokeTx.add(
          createSetAuthorityInstruction(mintAddress, payer, 2, null) // Revoke Owner
        );
      }

      revokeTx.feePayer = payer;
      revokeTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const { signature: revokeTxSig } = await signAndSendTransaction(revokeTx as any);
      signatures.push(revokeTxSig);
      console.log('Revoke authorities tx:', revokeTxSig);

      await connection.confirmTransaction(revokeTxSig, 'confirmed');
    }

    return {
      mintAddress: mintAddress.toBase58(),
      tokenAccountAddress: tokenAccountAddress.toBase58(),
      transactionSignatures: signatures,
      success: true,
    };
  } catch (error) {
    console.error('Token creation failed:', error);
    return {
      mintAddress: '',
      tokenAccountAddress: '',
      transactionSignatures: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
