import React, { useEffect, useState } from 'react';
import { Hero } from './components/Hero';
import { ApplicationForm } from './components/ApplicationForm';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { SiteContent, DEFAULT_CONTENT } from './types';
import { Settings, ShieldCheck } from 'lucide-react';

function App() {
  const [view, setView] = useState<'home' | 'admin'>('home');
  
  // Initialize from LocalStorage if available, otherwise use DEFAULT_CONTENT
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const savedContent = localStorage.getItem('pqg_site_content');
      return savedContent ? JSON.parse(savedContent) : DEFAULT_CONTENT;
    } catch (e) {
      console.error("Failed to load site content", e);
      return DEFAULT_CONTENT;
    }
  });

  useEffect(() => {
    // Dynamically update theme color
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", "#000000");
    } else {
      const meta = document.createElement('meta');
      meta.name = "theme-color";
      meta.content = "#000000";
      document.head.appendChild(meta);
    }
  }, []);

  // Save to LocalStorage whenever content changes
  useEffect(() => {
    localStorage.setItem('pqg_site_content', JSON.stringify(siteContent));
  }, [siteContent]);

  const toggleAdmin = () => {
    setView('admin');
  };

  if (view === 'admin') {
    return (
      <AdminDashboard 
        onBack={() => setView('home')} 
        content={siteContent}
        onUpdateContent={setSiteContent}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gold-500 selection:text-black font-sans relative">
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gold-900/30">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
             {/* Text Logo representation mimicking the image */}
             <div className="font-serif italic font-bold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-gold-600">
               PQG 1314
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleAdmin}
              className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-gold-400 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              老板后台
            </button>
            <a 
              href={`https://wa.me/${siteContent.contactPhone}`}
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2 text-sm font-medium text-gold-400 border border-gold-500/30 rounded-full hover:bg-gold-500 hover:text-black transition-colors"
            >
              联系客服
            </a>
          </div>
        </div>
      </nav>
      
      <main>
        <Hero content={siteContent} />
        
        {/* Product/Category Teaser */}
        <div className="bg-zinc-900 py-10 border-y border-zinc-800 overflow-hidden">
           <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-slate-500 font-medium text-sm md:text-base uppercase tracking-widest">
                 {siteContent.products.slice(0, 5).map((prod, idx) => (
                    <React.Fragment key={idx}>
                       <span>{prod}</span>
                       {idx < 4 && <span>•</span>}
                    </React.Fragment>
                 ))}
              </div>
           </div>
        </div>

        <ApplicationForm content={siteContent} />
      </main>

      <Footer content={siteContent} onAdminClick={toggleAdmin} />

      {/* Floating Admin Button for Demo/Owner Use */}
      <button 
        onClick={toggleAdmin}
        className="fixed bottom-6 right-6 z-50 bg-gold-600 text-white p-4 rounded-full shadow-lg hover:bg-gold-500 hover:scale-110 transition-all border-2 border-white/20 group"
        title="进入老板后台 (Admin)"
      >
        <Settings className="w-6 h-6 animate-spin-slow group-hover:animate-none" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          进入系统总控台
        </span>
      </button>
    </div>
  );
}

export default App;