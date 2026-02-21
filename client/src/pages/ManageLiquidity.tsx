/**
 * ManageLiquidity Page — Dark Solana Native Design
 */

import { useState } from 'react';
import { Settings, Search, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWallet } from '@/contexts/WalletContext';

export default function ManageLiquidity() {
  const { connected, connect, publicKey } = useWallet();
  const [poolAddress, setPoolAddress] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!connected) {
      connect();
      return;
    }
    if (!poolAddress.trim()) {
      toast.error('Please enter a pool address');
      return;
    }
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      toast.info('Pool lookup feature coming soon. Connect your wallet to manage existing pools.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-5">
              <Settings size={28} className="text-white" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full border border-[#9945FF]/30 bg-[#9945FF]/10 text-[#9945FF] text-xs font-bold uppercase tracking-wider mb-3">
              Pool Management
            </span>
            <h1 className="text-4xl font-extrabold text-white mb-3">Manage Liquidity</h1>
            <p className="text-white/50">
              Add or remove liquidity from your existing Raydium pools. Monitor your positions and optimize returns.
            </p>
          </div>

          {/* Search Pool */}
          <div className="sol-card p-6 mb-6">
            <h3 className="text-white font-bold mb-4">Find Your Pool</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter pool address or token mint address..."
                value={poolAddress}
                onChange={(e) => setPoolAddress(e.target.value)}
                className="flex-1 px-4 py-3 sol-input text-white placeholder-white/30 text-sm font-mono"
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                className="px-5 py-3 rounded-xl btn-gradient text-white font-bold flex items-center gap-2 disabled:opacity-60"
              >
                {searching ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
                Search
              </button>
            </div>
          </div>

          {/* My Positions */}
          {connected ? (
            <div className="sol-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">My Positions</h3>
                <span className="text-white/40 text-xs font-mono">{publicKey?.slice(0, 8)}...</span>
              </div>
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp size={20} className="text-white/30" />
                </div>
                <p className="text-white/40 text-sm">No liquidity positions found</p>
                <p className="text-white/20 text-xs mt-1">Create a liquidity pool to get started</p>
              </div>
            </div>
          ) : (
            <div className="sol-card p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <TrendingDown size={20} className="text-white/30" />
              </div>
              <p className="text-white/60 mb-4">Connect your wallet to view and manage your liquidity positions</p>
              <button
                onClick={connect}
                className="px-6 py-3 rounded-full btn-gradient text-white font-bold text-sm"
              >
                Connect Wallet
              </button>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {[
              { title: 'Add Liquidity', desc: 'Provide liquidity to earn trading fees from your pool', icon: <TrendingUp size={16} />, color: '#14F195' },
              { title: 'Remove Liquidity', desc: 'Withdraw your tokens and earned fees at any time', icon: <TrendingDown size={16} />, color: '#9945FF' },
            ].map((item, i) => (
              <div key={i} className="p-4 sol-card hover:border-[#9945FF]/30 transition-all">
                <div className="flex items-center gap-2 mb-2" style={{ color: item.color }}>
                  {item.icon}
                  <span className="font-bold text-sm">{item.title}</span>
                </div>
                <p className="text-white/40 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
