import React from 'react';
import { Lock } from 'lucide-react';
import { SiteContent } from '../types';

interface FooterProps {
  content: SiteContent;
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ content, onAdminClick }) => {
  return (
    <footer className="bg-black py-12 text-center border-t border-slate-900">
      <div className="container mx-auto px-4">
        <p className="text-slate-500 text-sm mb-2">
          &copy; {new Date().getFullYear()} PQG1314 品牌团队. 版权所有.
        </p>
        <p className="text-slate-600 text-xs">
          马来西亚顶尖微商/代理团队 • 打造您的创业梦想
        </p>
        <p className="text-gold-500/50 text-xs mt-4">
          客服热线: +{content.contactPhone}
        </p>
        
        {/* Hidden Admin Link */}
        <button 
          onClick={onAdminClick}
          className="mt-8 text-zinc-800 hover:text-zinc-700 transition-colors p-2"
          title="Admin Login"
        >
          <Lock className="w-3 h-3" />
        </button>
      </div>
    </footer>
  );
};