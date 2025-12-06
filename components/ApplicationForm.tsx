import React, { useState } from 'react';
import { AgentApplication, INCOME_GOALS, LOCATIONS, SiteContent } from '../types';
import { Send, CheckCircle2, Globe } from 'lucide-react';

interface ApplicationFormProps {
  content: SiteContent;
}

const COUNTRY_CODES = [
  { code: '+60', label: 'MY (+60)' },
  { code: '+65', label: 'SG (+65)' },
  { code: '+86', label: 'CN (+86)' },
  { code: '+886', label: 'TW (+886)' },
  { code: 'other', label: '其他' }
];

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ content }) => {
  const [countryCode, setCountryCode] = useState('+60');
  const [localPhone, setLocalPhone] = useState('');
  
  const [formData, setFormData] = useState<Omit<AgentApplication, 'phone'>>({
    name: '',
    location: LOCATIONS[0],
    reason: '',
    incomeGoal: INCOME_GOALS[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Combine country code and local phone
    const fullPhone = countryCode === 'other' ? localPhone : `${countryCode}${localPhone}`;

    // 1. SAVE TO DATABASE (Simulated by LocalStorage)
    const newLead: AgentApplication = {
      ...formData,
      phone: fullPhone,
      date: new Date().toISOString(),
      status: 'new'
    };
    
    // Add to local storage
    const history = JSON.parse(localStorage.getItem('pqg_leads') || '[]');
    history.push(newLead);
    localStorage.setItem('pqg_leads', JSON.stringify(history));

    // 2. CONSTRUCT WHATSAPP MESSAGE
    const message = `
*🌟 新代理申请通知 (PQG1314)*
---------------------------
*姓名:* ${formData.name}
*电话:* ${fullPhone}
*地区:* ${formData.location}

*目标收入:* ${formData.incomeGoal}
*加入动力:* ${formData.reason}
---------------------------
_系统自动生成_
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    
    // Use dynamic contact phone from content settings
    const targetPhone = content.contactPhone;
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedMessage}`;

    // 3. IMMEDIATE REDIRECT
    window.open(whatsappUrl, '_blank');

    // 4. Update UI State
    setShowSuccessModal(true);
    setIsSubmitting(false);
    
    // Clear form
    setFormData({
      name: '',
      location: LOCATIONS[0],
      reason: '',
      incomeGoal: INCOME_GOALS[0]
    });
    setLocalPhone('');

    // Auto-hide success modal
    setTimeout(() => {
       setShowSuccessModal(false);
    }, 5000);
  };

  return (
    <section id="application-form" className="py-20 bg-zinc-900 px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold-900/20 via-black to-black opacity-50 pointer-events-none" />
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-gold-500/50 rounded-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-200 shadow-[0_0_50px_rgba(245,158,11,0.3)]">
            <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6 text-black">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">提交成功！</h3>
            <p className="text-slate-400 mb-6">
              WhatsApp 窗口已自动打开。<br/>
              <span className="text-gold-400 text-sm">请在 WhatsApp 点击“发送”以完成报名。</span>
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-sm transition-colors"
            >
              关闭窗口
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Pitch */}
          <div className="lg:sticky lg:top-24">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              准备好改变现状了吗？<br/>
              <span className="text-gold-500">立即填表，锁定名额</span>
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              我们目前正在招募以下项目的代理：<br/>
              <span className="text-gold-400 font-medium">{content.products.join(' / ')}</span>
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0 border border-gold-500/20 font-bold text-xl group-hover:bg-gold-500 group-hover:text-black transition-colors">1</div>
                <div>
                  <h4 className="font-bold text-white text-lg group-hover:text-gold-400 transition-colors">填写资料</h4>
                  <p className="text-slate-500">您的资料将安全地记录在我们的后台系统。</p>
                </div>
              </div>
              <div className="flex gap-4 group">
                 <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0 border border-gold-500/20 font-bold text-xl group-hover:bg-gold-500 group-hover:text-black transition-colors">2</div>
                <div>
                  <h4 className="font-bold text-white text-lg group-hover:text-gold-400 transition-colors">快速审核</h4>
                  <p className="text-slate-500">提交后，我们将立即安排专人查阅您的申请。</p>
                </div>
              </div>
              <div className="flex gap-4 group">
                 <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0 border border-gold-500/20 font-bold text-xl group-hover:bg-gold-500 group-hover:text-black transition-colors">3</div>
                <div>
                  <h4 className="font-bold text-white text-lg group-hover:text-gold-400 transition-colors">WhatsApp 自动对接</h4>
                  <p className="text-slate-500">点击提交后，直接跳转 WhatsApp 发送报名表。</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="glass-card p-8 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.1)] border border-gold-500/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gold-200 mb-2">您的姓名 (Name)</label>
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder-slate-600"
                  placeholder="请输入您的姓名"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gold-200 mb-2">WhatsApp 号码</label>
                  <div className="flex">
                    <div className="relative">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-[100px] bg-black/50 border border-slate-700 border-r-0 rounded-l-lg px-2 py-3 text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none appearance-none cursor-pointer"
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>{c.label}</option>
                        ))}
                      </select>
                      <Globe className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                    <input 
                      required
                      type="tel" 
                      value={localPhone}
                      onChange={(e) => setLocalPhone(e.target.value)}
                      className="w-full bg-black/50 border border-slate-700 rounded-r-lg px-4 py-3 text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none placeholder-slate-600"
                      placeholder="12-3456789"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gold-200 mb-2">目前所在地区</label>
                  <select 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none appearance-none"
                  >
                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gold-200 mb-2">每月目标收入</label>
                <select 
                  name="incomeGoal"
                  value={formData.incomeGoal}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none"
                >
                  {INCOME_GOALS.map(goal => <option key={goal} value={goal}>{goal}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gold-200 mb-2">为什么想要加入 / 想要赚多少钱？</label>
                <textarea 
                  required
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none placeholder-slate-600"
                  placeholder="例如：我想通过副业增加收入，目标是今年买一辆新车..."
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold py-4 rounded-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '正在跳转...' : (
                  <>
                    提交报名 (WhatsApp)
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
              
              <p className="text-center text-xs text-slate-500">
                点击提交后，系统将自动跳转 WhatsApp 进行对接。
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};