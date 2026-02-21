/**
 * Home Page — Dark Solana Native Design
 * Hero: Earth-from-space background, gradient headline
 * Features: Stats, feature cards, CTA
 * Colors: #000000 bg, #9945FF primary, #14F195 secondary
 * Font: Plus Jakarta Sans
 */

import { useLocation } from 'wouter';
import { useState } from 'react';
import { Rocket, Zap, Shield, Globe, ArrowRight, Star, TrendingUp, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/i4PPlX9J9Pmkgz6M1ccn48/sandbox/TpEOTGMAW9fG3dq6FXwaS8-img-1_1771631501000_na1fn_aGVyby1zcGFjZS1lYXJ0aA.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvaTRQUGxYOUo5UG1rZ3o2TTFjY240OC9zYW5kYm94L1RwRU9UR01BVzlmRzNkcTZGWHdhUzgtaW1nLTFfMTc3MTYzMTUwMTAwMF9uYTFmbl9hR1Z5YnkxemNHRmpaUzFsWVhKMGFBLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=l889lYAs~8Z7o1OU6APaE-Ej0cF328cR-8wjF5vO1Uii7O3Fi3vtg4gYZbmYZ6ZofBR6JjmsXxjlBqYD3aVf2i6OO65H6liZDh96vj9y8hoFLdHDJukNf0Z7t4sA90D4bYtF-7PnXk4q6-X8mHucysDqzdYkJHdFjdHRmcLm8OwSkyok-VCTyouFz4vGy7bG9OvEQcnUPkpzldnjMdYYhuXz-51vA9eF2QoIx0qE156dlJ2oycOPsLQqBNLxV13upXnSpiE33D2LaxzA1tbMNdXudVL9UvEbZBGt5pBOSixq-5Ilb5v2J1OZ0BfPE1pNzLStibv24knCjXWdAsMoEw__";

const FEATURES_BG = "https://private-us-east-1.manuscdn.com/sessionFile/i4PPlX9J9Pmkgz6M1ccn48/sandbox/TpEOTGMAW9fG3dq6FXwaS8-img-3_1771631500000_na1fn_ZmVhdHVyZXMtYmc.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvaTRQUGxYOUo5UG1rZ3o2TTFjY240OC9zYW5kYm94L1RwRU9UR01BVzlmRzNkcTZGWHdhUzgtaW1nLTNfMTc3MTYzMTUwMDAwMF9uYTFmbl9abVZoZEhWeVpYTXRZbWMuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=vSVby8CfH5-jl~ECY34dUBODDQk4vAMxqFpVmAj9O9z82Mm8fL1LiExcsT40q~xE-oJhpsSac5PsmcIjWmmnrPno5F-RZFPf6RIDpEZAz452xNXE3iLWL9FT4Fpi8et4snFmnkV7eaozjgVMpO4mwmfuE0v9FD-kqJvPWI7Mbh3mLB~A6MFSdtj8lyoFk~eOa8xySjKxgYMdJOc60p7vWbxUxoO2xH~Ieg8GrcXhcSdLPrzaO0l9-OCfIkTuRdkcqxl0UaBKiMqmvzkReiHASavlybKsmjh2mPsb0UBq9ywciVBVS6IlsJNrkwXNSVlC9PmOaw1FOIM2kkdHOFpHZA__";

const features = [
  {
    icon: <Zap size={24} />,
    title: 'Lightning Fast Deployment',
    description: 'Deploy your Solana token in under 60 seconds. Our optimized infrastructure ensures instant token creation with zero delays.',
    color: '#9945FF',
  },
  {
    icon: <Shield size={24} />,
    title: 'Secure & Audited',
    description: 'Battle-tested smart contracts with full security audits. Your tokens are created with the highest security standards on Solana.',
    color: '#14F195',
  },
  {
    icon: <Globe size={24} />,
    title: 'Zero Coding Required',
    description: 'No programming knowledge needed. Our intuitive interface guides you through every step of the token creation process.',
    color: '#9945FF',
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Liquidity Pool Ready',
    description: 'Instantly create and manage liquidity pools on Raydium DEX. Get your token trading in minutes after launch.',
    color: '#14F195',
  },
  {
    icon: <Users size={24} />,
    title: 'Community Driven',
    description: 'Join thousands of creators who have launched successful tokens. Access our Discord community for support and collaboration.',
    color: '#9945FF',
  },
  {
    icon: <Star size={24} />,
    title: 'Full Authority Control',
    description: 'Revoke freeze, mint, and update authorities to build investor trust. Full control over your token\'s governance structure.',
    color: '#14F195',
  },
];

const stats = [
  { value: '50,000+', label: 'Tokens Launched' },
  { value: '99.9%', label: 'Success Rate' },
  { value: '85%+', label: 'Return Users' },
  { value: '0.05 SOL', label: 'Starting Fee' },
];

export default function Home() {
  const [, navigate] = useLocation();
  const [tokenName, setTokenName] = useState('');

  const handleCreateToken = () => {
    if (tokenName.trim()) {
      navigate(`/create-token?name=${encodeURIComponent(tokenName)}`);
    } else {
      navigate('/create-token');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-sm text-white/80 mb-8 fade-up fade-up-delay-1">
            <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
            #1 Solana Token Launcher in the World
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 fade-up fade-up-delay-2">
            Launch your{' '}
            <span className="gradient-text">$Solana</span> Token
            <br />
            Take it to the{' '}
            <span className="gradient-text">Moon!</span> 🌙
          </h1>

          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto fade-up fade-up-delay-3">
            Create and deploy your Solana coin effortlessly in seconds.
            Reach the world and scale without limits!
          </p>

          {/* CTA Input */}
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto fade-up fade-up-delay-4">
            <input
              type="text"
              placeholder="Create your first token..."
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateToken()}
              className="flex-1 w-full px-5 py-3.5 rounded-full sol-input text-white placeholder-white/40 text-sm"
            />
            <button
              onClick={handleCreateToken}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full btn-gradient text-white font-bold text-sm whitespace-nowrap"
            >
              <Rocket size={16} />
              Create Token
            </button>
          </div>

          {/* Fee note */}
          <p className="text-white/40 text-xs mt-4 fade-up fade-up-delay-4">
            Service fee: only 0.05 SOL — No coding required
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-xs">Scroll to explore</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 sol-card hover:border-[#9945FF]/40 transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-extrabold gradient-text mb-2">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#9945FF]/30 bg-[#9945FF]/10 text-[#9945FF] text-xs font-semibold uppercase tracking-wider mb-4">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Create & Deploy Your Token
              <br />
              <span className="gradient-text">in Minutes</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Turn your idea into reality with lightning-fast token creation. Whether for projects, communities, or innovation — deploy your Solana token with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Connect Wallet', desc: 'Connect your Phantom wallet to get started. No registration required — just your wallet.' },
              { step: '02', title: 'Configure Token', desc: 'Set your token name, symbol, supply, logo, and optional metadata. Full customization in one form.' },
              { step: '03', title: 'Launch & Trade', desc: 'Pay the 0.05 SOL service fee, confirm in Phantom, and your token is live on Solana mainnet.' },
            ].map((item, i) => (
              <div key={i} className="relative p-6 sol-card group hover:border-[#9945FF]/50 transition-all duration-300">
                <div className="text-6xl font-black text-white/5 absolute top-4 right-4">{item.step}</div>
                <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/create-token')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full btn-gradient text-white font-bold text-base"
            >
              <Rocket size={18} />
              Create Token Now
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: `url(${FEATURES_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#14F195]/30 bg-[#14F195]/10 text-[#14F195] text-xs font-semibold uppercase tracking-wider mb-4">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Unlock the Full Potential of
              <br />
              <span className="gradient-text">Your Solana Token</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Create, manage, and launch your Solana token effortlessly with secure transactions, instant deployment, and zero coding required!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 sol-card hover:border-[#9945FF]/40 transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                  style={{ background: `${feature.color}20`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-base mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="p-10 sol-card purple-glow">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Ready to Launch Your
              <br />
              <span className="gradient-text">Solana Token?</span>
            </h2>
            <p className="text-white/50 mb-8 max-w-lg mx-auto">
              Join thousands of creators who have already launched their tokens on Solana. Start for just 0.05 SOL.
            </p>
            <button
              onClick={() => navigate('/create-token')}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full btn-gradient text-white font-bold text-lg"
            >
              <Rocket size={20} />
              Launch Your Token
            </button>
            <p className="text-white/30 text-xs mt-4">Service fee: 0.05 SOL · Powered by Solana Blockchain</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
