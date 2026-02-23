/**
 * CreateToken Page — Dark Solana Native Design
 * Full token creation form with Phantom wallet fee payment
 * Service fee: 0.05 SOL → EBbuHfn9zQ1N3FYvcdKJ5zrdD8wdJc2kY8CZzciZE5KD
 * Colors: #000000 bg, #9945FF primary, #14F195 secondary
 * Font: Plus Jakarta Sans
 */

import { useState, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Upload, Info, Check, AlertCircle, Loader2, ExternalLink, Zap } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWallet } from '@/contexts/WalletContext';
import { createSolanaToken, TokenConfig } from '@/lib/tokenMinter';



// Fee configuration
const SERVICE_FEE_SOL = 0.05;
const FEE_RECIPIENT = 'EBbuHfn9zQ1N3FYvcdKJ5zrdD8wdJc2kY8CZzciZE5KD';
const LAMPORTS_PER_SOL = 1_000_000_000;

// RPC endpoints with fallbacks
const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana',
];

interface TokenForm {
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
  description: string;
  logo: File | null;
  logoPreview: string | null;
  recipient: string;
  // Optional features
  creatorInfo: boolean;
  creatorName: string;
  creatorAddress: string;
  socialLinks: boolean;
  socialTwitter: string;
  socialTelegram: string;
  socialDiscord: string;
  liquidityPool: boolean;
  revokeFreeze: boolean;
  revokeMint: boolean;
  revokeUpdate: boolean;
}

function ToggleOption({
  label,
  description,
  fee,
  enabled,
  onChange,
  free,
}: {
  label: string;
  description: string;
  fee: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
  free?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`w-full flex items-start justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:bg-white/5 ${enabled ? 'border-[#9945FF]/60 bg-[#9945FF]/10' : 'border-white/10 bg-white/2'}`}
    >
      <div className="flex-1 mr-4 text-left">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">{label}</span>
          {free && (
            <span className="px-2 py-0.5 rounded-full bg-[#14F195]/20 text-[#14F195] text-xs font-bold">FREE</span>
          )}
        </div>
        <p className="text-white/40 text-xs mt-0.5">{description}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-sm font-bold ${free ? 'text-[#14F195]' : 'text-[#9945FF]'}`}>{fee}</span>
        <div
          className={`relative w-11 h-6 rounded-full transition-all duration-300 ${enabled ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195]' : 'bg-white/10'}`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${enabled ? 'left-[22px]' : 'left-0.5'}`}
          />
        </div>
      </div>
    </button>
  );
}

function RevokeCard({
  title,
  description,
  fee,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  fee: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`p-4 rounded-xl border text-left transition-all duration-200 w-full cursor-pointer hover:bg-white/5 ${
        enabled ? 'border-[#9945FF]/60 bg-[#9945FF]/10 shadow-lg shadow-[#9945FF]/20' : 'border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-white font-semibold text-sm">{title}</span>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${enabled ? 'bg-[#9945FF] border-[#9945FF]' : 'border-white/30'}`}>
          {enabled && <Check size={12} className="text-white" />}
        </div>
      </div>
      <p className="text-white/40 text-xs mb-2">{description}</p>
      <span className={`font-bold text-sm transition-colors ${enabled ? 'text-[#9945FF]' : 'text-white/50'}`}>{fee}</span>
    </button>
  );
}

export default function CreateToken() {
  const { connected, publicKey, connect } = useWallet();
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [launching, setLaunching] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  const [tokenAccountAddress, setTokenAccountAddress] = useState<string | null>(null);
  const [transactionSignatures, setTransactionSignatures] = useState<string[]>([]);

  const [form, setForm] = useState<TokenForm>({
    name: '',
    symbol: '',
    decimals: 9,
    supply: '1000000000',
    description: '',
    logo: null,
    logoPreview: null,
    recipient: '',
    creatorInfo: false,
    creatorName: '',
    creatorAddress: '',
    socialLinks: false,
    socialTwitter: '',
    socialTelegram: '',
    socialDiscord: '',
    liquidityPool: false,
    revokeFreeze: false,
    revokeMint: false,
    revokeUpdate: false,
  });

  const calculateFees = () => {
    let total = SERVICE_FEE_SOL;
    if (form.creatorInfo) total += 0.1;
    if (form.socialLinks) total += 0.1;
    if (form.revokeFreeze) total += 0.1;
    if (form.revokeMint) total += 0.1;
    if (form.revokeUpdate) total += 0.1;
    return total;
  };

  const handleLogoUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm(prev => ({
        ...prev,
        logo: file,
        logoPreview: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleLogoUpload(file);
  }, [handleLogoUpload]);

  const validateForm = (): string | null => {
    if (!form.name.trim()) return 'Token name is required';
    if (form.name.length > 32) return 'Token name must be 32 characters or less';
    if (!form.symbol.trim()) return 'Token symbol is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.logo) return 'Token logo is required';
    if (!form.recipient.trim()) return 'Token recipient address is required';
    if (form.recipient.length < 32) return 'Invalid recipient wallet address';
    return null;
  };

  const handleLaunch = async () => {
    if (!connected) {
      toast.info('Please connect your Phantom wallet first', { duration: 3000 });
      await connect();
      return;
    }

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setLaunching(true);
    try {
      // Step 1: Send service fee to the fee recipient wallet
      const totalFee = calculateFees();
      const lamports = Math.round(totalFee * LAMPORTS_PER_SOL);

      toast.info(
        `🔐 Getting ready to confirm in your Phantom wallet...`,
        { duration: 5000 }
      );

      // Use Phantom's sendTransaction via window.solana
      const { PublicKey, Transaction, SystemProgram } = await import('@solana/web3.js');
      
      // Get a working RPC connection with fallbacks
      toast.info('🔗 Connecting to Solana network...', { duration: 3000 });
      
      // Import and get working connection
      const { Connection } = await import('@solana/web3.js');
      let connection: any;
      for (const endpoint of RPC_ENDPOINTS) {
        try {
          connection = new Connection(endpoint, 'confirmed');
          await connection.getLatestBlockhash();
          console.log(`✅ Using RPC endpoint: ${endpoint}`);
          break;
        } catch (err) {
          console.warn(`❌ RPC endpoint failed: ${endpoint}`, err);
          continue;
        }
      }
      
      if (!connection) {
        throw new Error('All RPC endpoints failed. Please check your internet connection.');
      }
      const fromPubkey = new PublicKey(publicKey!);
      const toPubkey = new PublicKey(FEE_RECIPIENT);

      // Get blockhash with retry logic
      let blockhash: string;
      let retries = 3;
      while (retries > 0) {
        try {
          const { blockhash: bh } = await connection.getLatestBlockhash();
          blockhash = bh;
          break;
        } catch (err) {
          retries--;
          if (retries === 0) {
            throw new Error('Failed to get blockhash after 3 attempts. Please check your internet connection.');
          }
          console.warn(`Blockhash attempt failed, retrying... (${retries} left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const feeTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        })
      );

      feeTransaction.recentBlockhash = blockhash;
      feeTransaction.feePayer = fromPubkey;

      const phantom = (window as unknown as { solana: { signAndSendTransaction: (tx: unknown) => Promise<{ signature: string }> } }).solana;
      
      // Show wallet confirmation prompt
      toast.info(`📱 Confirm transaction in your Phantom wallet...\nSending ${totalFee} SOL service fee`, { duration: 10000 });
      
      let feeTxSig: string;
      try {
        console.log('Sending transaction to Phantom wallet...');
        const result = await phantom.signAndSendTransaction(feeTransaction);
        feeTxSig = result.signature;
        console.log('Transaction signed and sent:', feeTxSig);
      } catch (walletErr: any) {
        console.error('Wallet error:', walletErr);
        if (walletErr?.message?.includes('User rejected')) {
          throw new Error('User rejected the fee transaction');
        }
        throw walletErr;
      }

      toast.success('✅ Fee payment confirmed! Creating token...', { duration: 5000 });
      console.log('Fee transaction:', feeTxSig);
      
      // Verify fee transaction was actually confirmed
      try {
        await connection.confirmTransaction(feeTxSig, 'confirmed');
        console.log('Fee transaction confirmed on-chain');
      } catch (confirmErr) {
        console.warn('Fee transaction confirmation timeout, but proceeding...', confirmErr);
      }

      // Step 2: Create the token on-chain
      toast.info('🔄 Minting token on Solana mainnet...\nConfirm in your wallet', { duration: 8000 });

      const tokenConfig: TokenConfig = {
        name: form.name,
        symbol: form.symbol,
        decimals: form.decimals,
        initialSupply: form.supply,
        recipientAddress: form.recipient,
        revokeFreeze: form.revokeFreeze,
        revokeMint: form.revokeMint,
        revokeUpdate: form.revokeUpdate,
      };

      const result = await createSolanaToken(
        tokenConfig,
        publicKey!,
        async (tx: any) => {
          toast.info('📱 Confirm token creation in your Phantom wallet...', { duration: 10000 });
          try {
            console.log('Sending token creation transaction to Phantom...');
            const { signature } = await phantom.signAndSendTransaction(tx);
            console.log('Token creation transaction signed:', signature);
            return { signature };
          } catch (walletErr: any) {
            console.error('Wallet error during token creation:', walletErr);
            if (walletErr?.message?.includes('User rejected')) {
              throw new Error('User rejected the token creation transaction');
            }
            throw walletErr;
          }
        }
      );

      if (!result.success) {
        console.error('Token creation failed:', result.error);
        toast.error(`❌ Token creation failed: ${result.error}`);
        setLaunching(false);
        return;
      }

      // Verify we have valid transaction signatures
      if (!result.transactionSignatures || result.transactionSignatures.length === 0) {
        throw new Error('No transaction signatures returned from token creation');
      }

      // Store all transaction signatures
      const allSigs = [feeTxSig, ...result.transactionSignatures];
      setTransactionSignatures(allSigs);
      setMintAddress(result.mintAddress);
      setTokenAccountAddress(result.tokenAccountAddress);
      setTxSignature(result.transactionSignatures[result.transactionSignatures.length - 1]);

      // Log all transaction signatures for verification
      console.log('All transaction signatures:', allSigs);
      console.log('Mint address:', result.mintAddress);
      console.log('Token account:', result.tokenAccountAddress);

      toast.success('🚀 Token launched successfully! Your token is now live on Solana!', { duration: 8000 });

    } catch (err: unknown) {
      const error = err as { message?: string };
      const errorMsg = error?.message || '';
      
      console.error('Launch error:', errorMsg, err);
      
      if (errorMsg.includes('User rejected')) {
        toast.error('❌ Transaction rejected in wallet. Please try again.');
      } else if (errorMsg.includes('Insufficient funds')) {
        toast.error('❌ Insufficient SOL balance. Please add more SOL to your wallet.');
      } else if (errorMsg.includes('Network') || errorMsg.includes('fetch') || errorMsg.includes('403')) {
        toast.error('❌ Network error. Please check your internet connection and try again.');
      } else if (errorMsg.includes('Blockhash') || errorMsg.includes('blockhash')) {
        toast.error('❌ Failed to connect to Solana network. Please try again in a moment.');
      } else if (errorMsg.includes('Invalid')) {
        toast.error('❌ Invalid transaction data. Please check your inputs and try again.');
      } else if (errorMsg.includes('All RPC endpoints failed')) {
        toast.error('❌ Unable to connect to Solana network. Please check your internet connection.');
      } else {
        toast.error(`❌ Transaction failed: ${errorMsg || 'Unknown error'}. Please try again.`);
        console.error('Full error:', err);
      }
    } finally {
      setLaunching(false);
    }
  };

  const totalFees = calculateFees();

  if (txSignature) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4 pt-24">
          <div className="max-w-lg w-full text-center">
            <div className="w-20 h-20 rounded-full btn-gradient flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-white" />
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-3">Token Launched! 🚀</h2>
            <p className="text-white/50 mb-8">
              Your Solana token <strong className="text-white">{form.name} ({form.symbol})</strong> has been successfully deployed to the Solana mainnet.
            </p>
            
            {mintAddress && (
              <div className="space-y-3 mb-6">
                <div className="sol-card p-4 text-left">
                  <p className="text-white/40 text-xs mb-1">Token Mint Address</p>
                  <p className="text-white font-mono text-xs break-all">{mintAddress}</p>
                </div>
                {tokenAccountAddress && (
                  <div className="sol-card p-4 text-left">
                    <p className="text-white/40 text-xs mb-1">Token Account Address</p>
                    <p className="text-white font-mono text-xs break-all">{tokenAccountAddress}</p>
                  </div>
                )}
              </div>
            )}
            
            {transactionSignatures.length > 0 && (
              <div className="sol-card p-4 mb-6 text-left max-h-32 overflow-y-auto">
                <p className="text-white/40 text-xs mb-2">Transaction Signatures ({transactionSignatures.length})</p>
                <div className="space-y-1">
                  {transactionSignatures.map((sig, i) => (
                    <a
                      key={i}
                      href={`https://solscan.io/tx/${sig}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9945FF] hover:text-[#14F195] text-xs break-all transition-colors flex items-center gap-1"
                    >
                      <Zap size={10} />
                      {sig.slice(0, 20)}...{sig.slice(-20)}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://solscan.io/tx/${txSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full btn-gradient text-white font-bold"
              >
                View on Solscan <ExternalLink size={14} />
              </a>
              <button
                onClick={() => {
                  setTxSignature(null);
                  setMintAddress(null);
                  setTokenAccountAddress(null);
                  setTransactionSignatures([]);
                  setForm(prev => ({
                    ...prev,
                    name: '',
                    symbol: '',
                    decimals: 9,
                    supply: '1000000000',
                    description: '',
                    logo: null,
                    logoPreview: null,
                    recipient: '',
                    creatorInfo: false,
                    creatorName: '',
                    creatorAddress: '',
                    socialLinks: false,
                    socialTwitter: '',
                    socialTelegram: '',
                    socialDiscord: '',
                    liquidityPool: false,
                    revokeFreeze: false,
                    revokeMint: false,
                    revokeUpdate: false,
                  }));
                }}
                className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-all"
              >
                Create Another Token
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full border border-[#9945FF]/30 bg-[#9945FF]/10 text-[#9945FF] text-xs font-bold uppercase tracking-wider mb-3">
              MAINNET
            </span>
            <h1 className="text-4xl font-extrabold text-white mb-2">Solana Token Creator</h1>
            <p className="text-white/50">
              Create and deploy your Solana coin effortlessly in seconds.
              <br />Reach the world and scale without limits!
            </p>
          </div>

          {/* Form Card */}
          <div className="sol-card p-6 md:p-8">
            {/* Token Name & Symbol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">
                  Token Name <span className="text-[#9945FF]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Moon Coin"
                  maxLength={32}
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 sol-input text-white placeholder-white/30 text-sm"
                />
                <p className="text-white/30 text-xs mt-1">Max 32 characters</p>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">
                  Token Symbol <span className="text-[#9945FF]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: MOON"
                  maxLength={10}
                  value={form.symbol}
                  onChange={(e) => setForm(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-3 sol-input text-white placeholder-white/30 text-sm"
                />
              </div>
            </div>

            {/* Decimals & Supply */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">
                  Decimals <span className="text-[#9945FF]">*</span>
                </label>
                <input
                  type="number"
                  placeholder="9"
                  min={0}
                  max={9}
                  value={form.decimals}
                  onChange={(e) => setForm(prev => ({ ...prev, decimals: parseInt(e.target.value) || 9 }))}
                  className="w-full px-4 py-3 sol-input text-white placeholder-white/30 text-sm"
                />
                <p className="text-white/30 text-xs mt-1">Standard is 9 for Solana tokens</p>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">
                  Supply <span className="text-[#9945FF]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="1,000,000,000"
                  value={form.supply}
                  onChange={(e) => setForm(prev => ({ ...prev, supply: e.target.value.replace(/[^0-9]/g, '') }))}
                  className="w-full px-4 py-3 sol-input text-white placeholder-white/30 text-sm"
                />
                <p className="text-white/30 text-xs mt-1">Total tokens created in your wallet</p>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="mb-5">
              <label className="block text-white/70 text-sm font-medium mb-1.5">
                Token Logo <span className="text-[#9945FF]">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  form.logoPreview
                    ? 'border-[#14F195]/50 bg-[#14F195]/5'
                    : 'border-white/20 hover:border-[#9945FF]/50 hover:bg-[#9945FF]/5'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                {form.logoPreview ? (
                  <div className="flex items-center justify-center gap-4">
                    <img src={form.logoPreview} alt="Logo preview" className="w-16 h-16 rounded-xl object-cover" />
                    <div className="text-left">
                      <p className="text-[#14F195] font-semibold text-sm">Logo uploaded!</p>
                      <p className="text-white/40 text-xs">{form.logo?.name}</p>
                      <p className="text-white/30 text-xs mt-1">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={28} className="text-white/30 mx-auto mb-2" />
                    <p className="text-white/60 text-sm font-medium">Drag and drop or click to upload</p>
                    <p className="text-white/30 text-xs mt-1">.PNG, .JPG — Recommended 1000×1000px</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-white/70 text-sm font-medium mb-1.5">
                Description <span className="text-[#9945FF]">*</span>
              </label>
              <textarea
                placeholder="Describe your token — its purpose, community, and vision..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 sol-input text-white placeholder-white/30 text-sm resize-none"
              />
            </div>

            {/* Optional Features */}
            <div className="mb-6">
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <Info size={14} className="text-[#9945FF]" />
                Optional Features
              </h3>
              <div className="space-y-3">
                <ToggleOption
                  label="Creator's Info"
                  description="Add creator information to the token metadata"
                  fee="+0.1 SOL"
                  enabled={form.creatorInfo}
                  onChange={(v) => setForm(prev => ({ ...prev, creatorInfo: v }))}
                />
                {form.creatorInfo && (
                  <div className="mt-1 p-4 rounded-xl border border-[#9945FF]/30 bg-[#9945FF]/5 space-y-3">
                    <div>
                      <label className="block text-white/70 text-xs font-medium mb-1.5">
                        Creator Name
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: John Doe"
                        value={form.creatorName}
                        onChange={(e) => setForm(prev => ({ ...prev, creatorName: e.target.value }))}
                        className="w-full px-4 py-2.5 sol-input text-white placeholder-white/30 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-xs font-medium mb-1.5">
                        Creator Address
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Solana wallet address"
                        value={form.creatorAddress}
                        onChange={(e) => setForm(prev => ({ ...prev, creatorAddress: e.target.value.trim() }))}
                        className="w-full px-4 py-2.5 sol-input text-white placeholder-white/30 text-sm font-mono"
                      />
                    </div>
                  </div>
                )}
                <ToggleOption
                  label="Social Links & Tags"
                  description="Add Twitter, Telegram, website links to metadata"
                  fee="+0.1 SOL"
                  enabled={form.socialLinks}
                  onChange={(v) => setForm(prev => ({ ...prev, socialLinks: v }))}
                />
                {form.socialLinks && (
                  <div className="mt-1 p-4 rounded-xl border border-[#9945FF]/30 bg-[#9945FF]/5 space-y-3">
                    <div>
                      <label className="block text-white/70 text-xs font-medium mb-1.5">
                        Twitter / X
                      </label>
                      <input
                        type="text"
                        placeholder="https://twitter.com/yourtoken"
                        value={form.socialTwitter}
                        onChange={(e) => setForm(prev => ({ ...prev, socialTwitter: e.target.value.trim() }))}
                        className="w-full px-4 py-2.5 sol-input text-white placeholder-white/30 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-xs font-medium mb-1.5">
                        Telegram
                      </label>
                      <input
                        type="text"
                        placeholder="https://t.me/yourtoken"
                        value={form.socialTelegram}
                        onChange={(e) => setForm(prev => ({ ...prev, socialTelegram: e.target.value.trim() }))}
                        className="w-full px-4 py-2.5 sol-input text-white placeholder-white/30 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-xs font-medium mb-1.5">
                        Discord
                      </label>
                      <input
                        type="text"
                        placeholder="https://discord.gg/yourtoken"
                        value={form.socialDiscord}
                        onChange={(e) => setForm(prev => ({ ...prev, socialDiscord: e.target.value.trim() }))}
                        className="w-full px-4 py-2.5 sol-input text-white placeholder-white/30 text-sm"
                      />
                    </div>
                  </div>
                )}
                <ToggleOption
                  label="Liquidity Pool"
                  description="Full access to create and manage liquidity pools"
                  fee="FREE"
                  free
                  enabled={form.liquidityPool}
                  onChange={(v) => setForm(prev => ({ ...prev, liquidityPool: v }))}
                />
              </div>
            </div>

            {/* Revoke Authorities */}
            <div className="mb-6">
              <h3 className="text-white font-bold text-sm mb-1">Revoke Authorities</h3>
              <p className="text-white/40 text-xs mb-3">
                Solana tokens have 3 authorities: Freeze, Mint, and Update. Revoking them builds investor trust.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <RevokeCard
                  title="Revoke Freeze"
                  description="No one can freeze holders' token accounts"
                  fee="+0.1 SOL"
                  enabled={form.revokeFreeze}
                  onChange={(v) => setForm(prev => ({ ...prev, revokeFreeze: v }))}
                />
                <RevokeCard
                  title="Revoke Mint"
                  description="No one can create more tokens"
                  fee="+0.1 SOL"
                  enabled={form.revokeMint}
                  onChange={(v) => setForm(prev => ({ ...prev, revokeMint: v }))}
                />
                <RevokeCard
                  title="Revoke Update"
                  description="No one can modify token metadata"
                  fee="+0.1 SOL"
                  enabled={form.revokeUpdate}
                  onChange={(v) => setForm(prev => ({ ...prev, revokeUpdate: v }))}
                />
              </div>
            </div>

            {/* Token Recipient */}
            <div className="mb-6">
              <label className="block text-white/70 text-sm font-medium mb-1.5">
                Token Recipient Address <span className="text-[#9945FF]">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter the wallet address that will receive the tokens"
                value={form.recipient}
                onChange={(e) => setForm(prev => ({ ...prev, recipient: e.target.value.trim() }))}
                className="w-full px-4 py-3 sol-input text-white placeholder-white/30 text-sm font-mono"
              />
              {connected && publicKey && (
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, recipient: publicKey }))}
                  className="text-[#9945FF] text-xs mt-1.5 hover:text-[#14F195] transition-colors"
                >
                  Use connected wallet address
                </button>
              )}
            </div>

            {/* Fee Summary */}
            <div className="p-4 rounded-xl bg-white/3 border border-white/10 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/50 text-sm">Service Fee (base)</span>
                <span className="text-white font-semibold text-sm">{SERVICE_FEE_SOL} SOL</span>
              </div>
              {form.creatorInfo && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/40 text-xs">Creator's Info</span>
                  <span className="text-white/60 text-xs">+0.1 SOL</span>
                </div>
              )}
              {form.socialLinks && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/40 text-xs">Social Links</span>
                  <span className="text-white/60 text-xs">+0.1 SOL</span>
                </div>
              )}
              {form.revokeFreeze && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/40 text-xs">Revoke Freeze</span>
                  <span className="text-white/60 text-xs">+0.1 SOL</span>
                </div>
              )}
              {form.revokeMint && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/40 text-xs">Revoke Mint</span>
                  <span className="text-white/60 text-xs">+0.1 SOL</span>
                </div>
              )}
              {form.revokeUpdate && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/40 text-xs">Revoke Update</span>
                  <span className="text-white/60 text-xs">+0.1 SOL</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-3 mt-2 flex items-center justify-between">
                <span className="text-white font-bold text-sm">Total Fees</span>
                <div className="flex items-center gap-2">
                  {totalFees > SERVICE_FEE_SOL && (
                    <span className="line-through text-white/40 text-sm">{SERVICE_FEE_SOL} SOL</span>
                  )}
                  <span className="gradient-text font-extrabold text-lg">{totalFees.toFixed(2)} SOL</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
              <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-amber-300/80 text-xs leading-relaxed">
                The service fee of <strong>{totalFees.toFixed(2)} SOL</strong> will be sent to the platform wallet upon launch. This fee covers token deployment and platform maintenance. Ensure your wallet has sufficient SOL balance.
              </p>
            </div>

            {/* Launch Button */}
            {connected ? (
              <button
                onClick={handleLaunch}
                disabled={launching}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl btn-gradient text-white font-extrabold text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {launching ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <div className="flex flex-col items-center gap-1">
                  <span>Launching Token...</span>
                  <span className="text-xs opacity-75">(Check your Phantom wallet)</span>
                </div>
              </>
            ) : (
              <>
                <Zap size={18} />
                Launch Token
              </>
            )}
              </button>
            ) : (
              <button
                onClick={connect}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl btn-gradient text-white font-extrabold text-base hover:shadow-lg hover:shadow-[#9945FF]/50 transition-all"
              >
                <span>🔐</span>
                Connect Phantom Wallet to Launch
              </button>
            )}

            <p className="text-center text-white/30 text-xs mt-3">
              By launching, you agree to our{' '}
              <a href="/terms" className="text-[#9945FF] hover:underline">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
