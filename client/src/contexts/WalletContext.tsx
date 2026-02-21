/**
 * WalletContext — Phantom Wallet Integration
 * Design: Dark Solana Native
 * Handles wallet connection, disconnection, and SOL transactions
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface WalletContextType {
  connected: boolean;
  publicKey: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendTransaction: (toAddress: string, lamports: number) => Promise<string>;
  balance: number | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey: { toString: () => string } | null;
      isConnected: boolean;
      signAndSendTransaction: (transaction: unknown) => Promise<{ signature: string }>;
      request: (params: { method: string; params?: unknown }) => Promise<unknown>;
    };
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.solana?.isPhantom && window.solana.isConnected && window.solana.publicKey) {
        setConnected(true);
        setPublicKey(window.solana.publicKey.toString());
      }
    };
    // Small delay to let Phantom inject
    setTimeout(checkConnection, 500);
  }, []);

  const fetchBalance = useCallback(async (address: string) => {
    try {
      const response = await fetch('https://api.mainnet-beta.solana.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address],
        }),
      });
      const data = await response.json();
      if (data.result?.value !== undefined) {
        setBalance(data.result.value / 1e9);
      }
    } catch {
      // ignore balance fetch errors
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.solana?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return;
    }
    setConnecting(true);
    try {
      const resp = await window.solana.connect();
      const address = resp.publicKey.toString();
      setPublicKey(address);
      setConnected(true);
      fetchBalance(address);
    } catch (err) {
      console.error('Wallet connection failed:', err);
    } finally {
      setConnecting(false);
    }
  }, [fetchBalance]);

  const disconnect = useCallback(async () => {
    if (window.solana) {
      await window.solana.disconnect();
    }
    setConnected(false);
    setPublicKey(null);
    setBalance(null);
  }, []);

  const sendTransaction = useCallback(async (toAddress: string, lamports: number): Promise<string> => {
    if (!window.solana || !publicKey) {
      throw new Error('Wallet not connected');
    }

    // Build a simple SOL transfer transaction using Solana JSON-RPC
    const { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } = await import('@solana/web3.js');
    
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const fromPubkey = new PublicKey(publicKey);
    const toPubkey = new PublicKey(toAddress);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    const signed = await (window.solana as unknown as {
      signAndSendTransaction: (tx: unknown) => Promise<{ signature: string }>
    }).signAndSendTransaction(transaction);

    return signed.signature;
  }, [publicKey]);

  return (
    <WalletContext.Provider value={{ connected, publicKey, connecting, connect, disconnect, sendTransaction, balance }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
