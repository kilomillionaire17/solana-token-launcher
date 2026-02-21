/**
 * Support Page — Dark Solana Native Design
 */

import { useState } from 'react';
import { MessageCircle, Mail, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const faqs = [
  {
    q: 'How much does it cost to create a token?',
    a: 'The base service fee is 0.05 SOL. Optional features like Creator\'s Info, Social Links, and Revoke Authorities each add 0.1 SOL. The total depends on which features you select.',
  },
  {
    q: 'Do I need coding knowledge to create a token?',
    a: 'No! SolLaunch is designed for everyone. Simply fill out the form, connect your Phantom wallet, and your token will be deployed to Solana mainnet in seconds.',
  },
  {
    q: 'Which wallets are supported?',
    a: 'We currently support Phantom Wallet, which is the most popular Solana wallet. Make sure you have the Phantom browser extension installed.',
  },
  {
    q: 'How do I add my token to a DEX?',
    a: 'After creating your token, use our Liquidity Pool feature to create a pool on Raydium DEX. This enables trading for your community.',
  },
  {
    q: 'What does "Revoke Authorities" mean?',
    a: 'Solana tokens have three authorities: Freeze (can freeze accounts), Mint (can create more tokens), and Update (can modify metadata). Revoking these builds investor trust by making the token immutable.',
  },
  {
    q: 'Can I recover my token if something goes wrong?',
    a: 'Blockchain transactions are irreversible. Always double-check all details before launching. We recommend testing with small amounts first.',
  },
  {
    q: 'How long does token creation take?',
    a: 'Token creation typically takes 10-30 seconds on Solana mainnet, depending on network congestion. You\'ll receive a transaction signature once complete.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-white font-medium text-sm">{q}</span>
        {open ? <ChevronUp size={16} className="text-[#9945FF] shrink-0" /> : <ChevronDown size={16} className="text-white/40 shrink-0" />}
      </button>
      {open && (
        <p className="text-white/50 text-sm pb-4 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function Support() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full border border-[#9945FF]/30 bg-[#9945FF]/10 text-[#9945FF] text-xs font-bold uppercase tracking-wider mb-3">
              Support
            </span>
            <h1 className="text-4xl font-extrabold text-white mb-3">How Can We Help?</h1>
            <p className="text-white/50">Find answers to common questions or reach out to our team.</p>
          </div>

          {/* Support Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
            <a
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 sol-card hover:border-[#9945FF]/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#5865F2]/20 flex items-center justify-center mb-4">
                <MessageCircle size={22} className="text-[#5865F2]" />
              </div>
              <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                Discord Community <ExternalLink size={12} className="text-white/30" />
              </h3>
              <p className="text-white/40 text-sm">Join our Discord for real-time support and community discussions.</p>
            </a>
            <div className="p-6 sol-card hover:border-[#9945FF]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#9945FF]/20 flex items-center justify-center mb-4">
                <Mail size={22} className="text-[#9945FF]" />
              </div>
              <h3 className="text-white font-bold mb-1">Email Support</h3>
              <p className="text-white/40 text-sm">Send us a message and we'll respond within 24 hours.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-6">Frequently Asked Questions</h2>
              <div className="sol-card p-4">
                {faqs.map((faq, i) => (
                  <FAQItem key={i} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="sol-card p-6 space-y-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1.5">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 sol-input text-white placeholder-white/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 sol-input text-white placeholder-white/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1.5">Message</label>
                  <textarea
                    placeholder="Describe your issue or question..."
                    rows={5}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 sol-input text-white placeholder-white/30 text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl btn-gradient text-white font-bold"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
