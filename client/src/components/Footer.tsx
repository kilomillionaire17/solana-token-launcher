/**
 * Footer — Dark Solana Native Design
 * Multi-column footer with links and branding
 */

import { Link } from 'wouter';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center">
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight">
                Sol<span className="gradient-text">Launch</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              The world's most powerful Solana token launcher. Create, deploy, and manage your tokens effortlessly.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/create-token', label: 'Create Token' },
                { href: '/liquidity-pool', label: 'Liquidity Pool' },
                { href: '/manage-liquidity', label: 'Manage Liquidity' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-white/50 hover:text-white text-sm transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Community</h4>
            <ul className="space-y-2">
              {[
                { href: 'https://discord.gg/', label: 'Discord Community', external: true },
                { href: '#', label: 'Live Chat' },
                { href: 'https://explorer.solana.com', label: 'Blockchain Explorer', external: true },
                { href: 'https://solana.com', label: 'About Solana', external: true },
              ].map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1"
                    >
                      {link.label} <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-white/50 hover:text-white text-sm transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              {[
                { href: 'https://phantom.app', label: 'Get Phantom Wallet', external: true },
                { href: 'https://raydium.io', label: 'Raydium DEX', external: true },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/support', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1"
                    >
                      {link.label} <ExternalLink size={10} />
                    </a>
                  ) : (
                    <Link href={link.href}>
                      <span className="text-white/50 hover:text-white text-sm transition-colors cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2025 SolLaunch. All rights reserved. Powered by Solana Blockchain.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
            <span className="text-white/30 text-xs">Mainnet</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
