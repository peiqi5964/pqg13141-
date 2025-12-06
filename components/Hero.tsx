import React from 'react';
import { ArrowRight, Star, Award, HeartHandshake, Sparkles } from 'lucide-react';
import { SiteContent } from '../types';

interface HeroProps {
  content: SiteContent;
}

export const Hero: React.FC<HeroProps> = ({ content }) => {
  const scrollToForm = () => {
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden bg-black pt-16 pb-32">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold-600/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-gold-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-900/30 border border-gold-500/30 text-gold-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>PQG1314 全马火热招募中</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
            {content.heroTitle}
            <br />
            <span className="text-4xl md:text-6xl text-gradient-gold font-extrabold block mt-2">{content.heroSubtitle}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            专注 <span className="text-white font-semibold">
              {content.products.slice(0, 3).join(' · ')}
            </span> 等赛道。
            <br className="hidden md:block"/>
            {content.heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToForm}
              className="px-10 py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold text-lg rounded-full hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              立即报名加入
              <ArrowRight className="w-5 h-5" />
            </button>
            <a 
              href="#benefits"
              className="px-10 py-4 bg-transparent border border-gold-600/50 text-gold-400 font-medium text-lg rounded-full hover:bg-gold-900/20 transition-all flex items-center justify-center"
            >
              了解更多
            </a>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { icon: Star, title: "多元化爆品", desc: `涵盖${content.products.slice(0, 4).join('、')}等，满足市场全方位需求。` },
              { icon: Award, title: "系统化培训", desc: "从小白到大咖，手把手教您引流与成交。" },
              { icon: HeartHandshake, title: "丰厚佣金制度", desc: "多劳多得，上不封顶，实现财务自由。" }
            ].map((feature, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl hover:bg-gold-900/10 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-gold-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};