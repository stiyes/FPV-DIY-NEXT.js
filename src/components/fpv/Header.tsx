'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Database, 
  Wrench, 
  BookOpen, 
  TrendingUp, 
  Users,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: '部件数据库', icon: Database },
  { href: '/builds', label: '装机配置', icon: Wrench },
  { href: '/community', label: '社区配置库', icon: Users },
  { href: '/tutorials', label: '装机教程', icon: BookOpen },
  { href: '/prices', label: '价格监控', icon: TrendingUp },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(0,240,255,0.2)] bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Cpu className="w-8 h-8 text-[#00f0ff] group-hover:animate-pulse" />
              <div className="absolute inset-0 bg-[#00f0ff] blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider text-white glitch" data-text="FPV.DB">
                FPV.DB
              </span>
              <span className="text-[10px] text-[#00f0ff] tracking-[0.3em] uppercase">
                Component Database
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#888] hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.1)] transition-all duration-200 group"
              >
                <item.icon className="w-4 h-4 group-hover:text-[#00f0ff]" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-[#ff00a0] text-[#ff00a0] hover:bg-[#ff00a0] hover:text-white transition-all"
            >
              <Zap className="w-4 h-4 mr-2" />
              快速装机
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-[#888] hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.1)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[rgba(0,240,255,0.2)] bg-[#0a0a0f]/95 backdrop-blur-md">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#888] hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.1)] transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-[rgba(0,240,255,0.2)]">
              <Button
                variant="outline"
                className="w-full border-[#ff00a0] text-[#ff00a0] hover:bg-[#ff00a0] hover:text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                快速装机
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
