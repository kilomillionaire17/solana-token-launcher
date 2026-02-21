/**
 * Navbar — Dark Solana Native Design
 * Pill-shaped nav with gradient Connect Wallet button
 * Phantom wallet integration
 */

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useWallet } from '@/contexts/WalletContext';
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const [location] = useLocation();
  const { connected, publicKey, connecting, connect, disconnect, balance } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/create-token', label: 'Create Token' },
    { href: '/liquidity-pool', label: 'Liquidity Pool' },
    { href: '/manage-liquidity', label: 'Manage Liquidity' },
    { href: '/support', label: 'Support' },
  ];

  const shortAddress = publicKey
    ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
    : '';

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      toast.success('Address copied!');
    }
    setShowDropdown(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight">
              Sol<span className="gradient-text">Launch</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav — pill shape */}
        <div className="hidden md:flex pill-nav items-center gap-1 px-2 py-1.5">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  location === link.href
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Connect Wallet Button */}
        <div className="relative">
          {connected ? (
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full pill-nav text-white text-sm font-semibold hover:bg-white/10 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
              <span>{shortAddress}</span>
              {balance !== null && (
                <span className="text-white/50 text-xs">{balance.toFixed(3)} SOL</span>
              )}
              <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <button
              onClick={connect}
              disabled={connecting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full btn-gradient text-white text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Wallet size={16} />
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}

          {/* Dropdown */}
          {showDropdown && connected && (
            <div className="absolute right-0 top-full mt-2 w-56 sol-card p-2 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-white/50 text-xs">Connected Wallet</p>
                <p className="text-white text-sm font-mono mt-0.5">{shortAddress}</p>
              </div>
              <button
                onClick={copyAddress}
                className="w-full flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-all"
              >
                <Copy size={14} /> Copy Address
              </button>
              <a
                href={`https://solscan.io/account/${publicKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-all"
                onClick={() => setShowDropdown(false)}
              >
                <ExternalLink size={14} /> View on Solscan
              </a>
              <button
                onClick={() => { disconnect(); setShowDropdown(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg text-sm transition-all"
              >
                <LogOut size={14} /> Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="w-5 h-0.5 bg-white mb-1 transition-all" />
          <div className="w-5 h-0.5 bg-white mb-1 transition-all" />
          <div className="w-5 h-0.5 bg-white transition-all" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 sol-card p-4 max-w-7xl mx-auto">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
