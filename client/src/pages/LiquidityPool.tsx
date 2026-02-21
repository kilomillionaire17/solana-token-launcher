/**
 * LiquidityPool Page — Dark Solana Native Design
 * Create and manage Raydium liquidity pools
 */

import { useState } from 'react';
import { Droplets, Info, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWallet } from '@/contexts/WalletContext';

const POOL_BG = "https://private-us-east-1.manuscdn.com/sessionFile/i4PPlX9J9Pmkgz6M1ccn48/sandbox/TpEOTGMAW9fG3dq6FXwaS8-img-2_1771631499000_na1fn_cGhvbmUtbW9ja3VwLWJn.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvaTRQUGxYOUo5UG1rZ3o2TTFjY240OC9zYW5kYm94L1RwRU9UR01BVzlmRzNkcTZGWHdhUzgtaW1nLTJfMTc3MTYzMTQ5OTAwMF9uYTFmbl9jR2h2Ym1VdGJXOWphM1Z3TFdKbi5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=kgakM-SWW6NX2gA8TZhEf-AH~9fLb3wg1jtJusmORMV58dHezsDQcpJ8Xp7-blnGXM5MfFh77UAgdzcyW5LMNcxf558Jg38Axeom-dPCTkpaon~dMLdLk8MmzuNaZwNZPZlVl7KCoS9-8j6hJdCBuOQDFZ2Td~B-jnGDKTE~jsrLP~PGMH2aonKVKCiHZExa7V6sflumUoSfGtSAzwZDQawdDvFSyVI0DxDnOupMOU-ji79IbsMO6~DtnGEXrd~koCyfjQyypmky~LfMgsD2wTI2wNWMBlYzV3Sh7~ZoLcRij2cuua5lej-m-yxCrbj--ad4NrpDnvMkArtdiK5JaA__";

export default function LiquidityPool() {
  const { connected, connect } = useWallet();
  const [form, setForm] = useState({
    baseToken: '',
    quoteToken: 'SOL',
    baseAmount: '',
    quoteAmount: '',
    startDate: '',
    startTime: '',
  });

  const handleCreate = () => {
    if (!connected) {
      connect();
      return;
    }
    toast.info('Liquidity pool creation coming soon! Connect your wallet and configure your pool settings.');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero */}
      <div
        className="relative pt-28 pb-16 px-4"
        style={{
          backgroundImage: `url(${POOL_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/85" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-5">
            <Droplets size={28} className="text-white" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full border border-[#14F195]/30 bg-[#14F195]/10 text-[#14F195] text-xs font-bold uppercase tracking-wider mb-3">
            Raydium DEX
          </span>
          <h1 className="text-4xl font-extrabold text-white mb-3">Create Liquidity Pool</h1>
          <p className="text-white/50">
            Launch your token's liquidity pool on Raydium DEX. Set initial prices and enable trading for your community.
          </p>
        </div>
      </div>

      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="sol-card p-6 md:p-8">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#14F195]/10 border border-[#14F195]/20 mb-6">
              <Info size={16} className="text-[#14F195] shrink-0" />
              <p className="text-[#14F195]/80 text-xs">
                Creating a liquidity pool requires your token to be already deployed. Make sure you have created your token first.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">
                  Base Token Address <span className="text-[#9945FF]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your token mint address"
                  value={form.baseToken}
                  onChange={(e) => setForm(prev => ({ ...prev, baseToken: e.target.value }))}
                  className="w-full px-4 py-3 sol-input text-white placeholder-white/30 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Quote Token</label>
                <select
                  value={form.quoteToken}
                  onChange={(e) => setForm(prev => ({ ...prev, quoteToken: e.target.value }))}
                  className="w-full px-4 py-3 sol-input text-white text-sm bg-transparent"
                >
                  <option value="SOL" className="bg-[#111118]">SOL</option>
                  <option value="USDC" className="bg-[#111118]">USDC</option>
                  <option value="USDT" className="bg-[#111118]">USDT</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">
                  Base Token Amount <span className="text-[#9945FF]">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Amount of your token"
                  value={form.baseAmount}
                  onChange={(e) => setForm(prev => ({ ...prev, baseAmount: e.target.value }))}
                  className="w-full px-4 py-3 sol-input text-white placeholder-white/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">
                  {form.quoteToken} Amount <span className="text-[#9945FF]">*</span>
                </label>
                <input
                  type="number"
                  placeholder={`Amount of ${form.quoteToken}`}
                  value={form.quoteAmount}
                  onChange={(e) => setForm(prev => ({ ...prev, quoteAmount: e.target.value }))}
                  className="w-full px-4 py-3 sol-input text-white placeholder-white/30 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 sol-input text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Start Time (UTC)</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-4 py-3 sol-input text-white text-sm"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
              <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-amber-300/80 text-xs leading-relaxed">
                Creating a liquidity pool on Raydium requires approximately 0.4 SOL for pool creation fees plus your initial liquidity. Ensure your wallet has sufficient balance.
              </p>
            </div>

            <button
              onClick={handleCreate}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl btn-gradient text-white font-extrabold text-base"
            >
              <Droplets size={18} />
              {connected ? 'Create Liquidity Pool' : 'Connect Wallet to Continue'}
            </button>

            <div className="mt-4 text-center">
              <a
                href="https://raydium.io/liquidity/create-pool/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white text-xs flex items-center justify-center gap-1 transition-colors"
              >
                Or create directly on Raydium <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
