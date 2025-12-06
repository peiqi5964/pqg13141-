import React, { useState, useEffect } from 'react';
import { AgentApplication, SiteContent } from '../types';
import { Users, Edit, MessageSquare, ArrowLeft, Save, ExternalLink, Settings, Phone, Database, PlayCircle, Bot, Download, HelpCircle, FileText } from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
  content: SiteContent;
  onUpdateContent: (newContent: SiteContent) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, content, onUpdateContent }) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'automation' | 'content'>('leads');
  const [leads, setLeads] = useState<AgentApplication[]>([]);
  const [editedContent, setEditedContent] = useState<SiteContent>(content);

  useEffect(() => {
    const savedLeads = JSON.parse(localStorage.getItem('pqg_leads') || '[]');
    setLeads(savedLeads.reverse()); // Show newest first
  }, []);

  const handleSaveContent = () => {
    onUpdateContent(editedContent);
    alert('网站内容已更新！');
  };

  // Helper to format phone number for WhatsApp
  // Smartly handles numbers with or without country codes
  const formatPhoneForWhatsapp = (phone: string) => {
    // Remove all non-numeric characters
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    
    // Check if it already has a country code prefix (basic check for length and common codes)
    // If it starts with 60 (MY), 65 (SG), 86 (CN), 886 (TW) etc, we assume it's good.
    if (cleanPhone.startsWith('60') || cleanPhone.startsWith('65') || cleanPhone.startsWith('86') || cleanPhone.startsWith('886')) {
      return cleanPhone;
    }
    
    // If it starts with 0 (e.g. 012...), default to Malaysia (60)
    if (cleanPhone.startsWith('0')) {
      return '6' + cleanPhone;
    }
    
    // Fallback: just return as is
    return cleanPhone;
  };

  const getFollowUpLink = (lead: AgentApplication) => {
    // Use the dynamic template from siteContent
    let template = content.followUpTemplate || "";
    
    // Replace placeholders
    template = template.replace(/{name}/g, lead.name);
    template = template.replace(/{income}/g, lead.incomeGoal);
    
    const formattedPhone = formatPhoneForWhatsapp(lead.phone);
    
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(template)}`;
  };

  const getChatLink = (phone: string) => {
     return `https://wa.me/${formatPhoneForWhatsapp(phone)}`;
  }

  const exportToCSV = () => {
    if (leads.length === 0) {
      alert("暂无数据可导出");
      return;
    }
    // Simple CSV export logic
    const headers = ["姓名", "电话", "地区", "目标收入", "加入原因", "提交时间"];
    const rows = leads.map(l => [
      `"${l.name}"`,
      `'${l.phone}`, // Force string for phone
      `"${l.location}"`,
      `"${l.incomeGoal}"`,
      `"${l.reason.replace(/"/g, '""')}"`,
      l.date
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\ufeff" 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PQG1314_Leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 pb-20 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
               <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                 PQG1314 总控台 
                 <span className="px-2 py-0.5 rounded bg-gold-500 text-black text-xs font-bold">ADMIN</span>
               </h1>
               <p className="text-xs text-slate-400">管理您的代理数据与网站内容</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            <button 
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'leads' ? 'bg-gold-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-zinc-800 text-slate-400 hover:bg-zinc-700'}`}
            >
              <Database className="w-4 h-4" /> 1. 顾客资料表 (Leads)
            </button>
            <button 
              onClick={() => setActiveTab('automation')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'automation' ? 'bg-gold-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-zinc-800 text-slate-400 hover:bg-zinc-700'}`}
            >
              <Bot className="w-4 h-4" /> 2. 自动化设置教程
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'content' ? 'bg-gold-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-zinc-800 text-slate-400 hover:bg-zinc-700'}`}
            >
              <Edit className="w-4 h-4" /> 3. 编辑网站
            </button>
          </div>
        </div>

        {/* TAB: LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5 text-gold-500" />
                  所有报名顾客资料
                </h2>
                <p className="text-sm text-slate-400">顾客在前台填写的表格，都会自动汇总到这里。</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={exportToCSV}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700 text-sm flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" /> 导出表格 (Excel/CSV)
                </button>
                <button 
                  onClick={() => {
                    if(confirm("确定要清空所有数据吗？此操作不可恢复。")) {
                      localStorage.removeItem('pqg_leads'); 
                      setLeads([]);
                    }
                  }}
                  className="px-3 py-2 text-red-500 hover:bg-red-500/10 rounded text-sm transition-colors"
                >
                  清空
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
              {leads.length === 0 ? (
                <div className="p-16 text-center flex flex-col items-center justify-center text-slate-500">
                  <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
                    <Database className="w-10 h-10 opacity-30" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-300 mb-2">暂无报名数据</h3>
                  <p className="max-w-xs mx-auto mb-6">目前还没有人填写表格。您可以去前台自己填一个试试，数据会立即出现在这里。</p>
                  <button onClick={onBack} className="px-6 py-2 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded-full transition-colors">
                    去前台添加测试数据
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-950 text-slate-400 uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-6 py-4">时间</th>
                        <th className="px-6 py-4">申请人资料</th>
                        <th className="px-6 py-4">详细信息</th>
                        <th className="px-6 py-4 text-center">后续跟进 (Action)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {leads.map((lead, idx) => (
                        <tr key={idx} className="hover:bg-zinc-800/50 transition-colors group">
                          <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                            <div className="font-mono text-xs">{lead.date ? new Date(lead.date).toLocaleDateString() : '-'}</div>
                            <div className="text-xs opacity-50">{lead.date ? new Date(lead.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-white text-base mb-1">{lead.name}</div>
                            <div className="flex items-center gap-2 text-gold-500 font-mono text-xs mb-1">
                              <Phone className="w-3 h-3" /> {lead.phone}
                            </div>
                            <div className="text-slate-500 text-xs bg-zinc-800 inline-block px-2 py-0.5 rounded">{lead.location}</div>
                          </td>
                          <td className="px-6 py-4 max-w-sm">
                            <div className="flex items-center gap-2 mb-2">
                               <span className="text-white font-medium bg-zinc-800 px-2 py-0.5 rounded text-xs border border-zinc-700">目标: {lead.incomeGoal}</span>
                            </div>
                            <div className="p-2 bg-black/30 rounded border border-zinc-800">
                               <div className="text-slate-400 text-xs italic mb-1">"{lead.reason}"</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2 items-center">
                              <a 
                                href={getChatLink(lead.phone)}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full max-w-[160px] px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-xs text-white flex items-center justify-center gap-2 transition-colors border border-zinc-600"
                              >
                                <MessageSquare className="w-3 h-3" /> 
                                打招呼 (Chat)
                              </a>
                              <a 
                                href={getFollowUpLink(lead)}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full max-w-[160px] px-3 py-2 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-gold-500/10"
                              >
                                <PlayCircle className="w-3 h-3" /> 
                                一键自动跟进
                              </a>
                              <span className="text-[10px] text-slate-600 mt-1">
                                *使用您自定义的模板
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: AUTOMATION TUTORIAL */}
        {activeTab === 'automation' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-gradient-to-r from-indigo-900/20 to-zinc-900 border border-indigo-500/30 rounded-2xl p-8 mb-8">
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                   <HelpCircle className="w-8 h-8" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-white mb-2">为什么网页不能自己“半夜回复”顾客？</h2>
                    <p className="text-slate-300 leading-relaxed max-w-3xl">
                      这是所有网页系统的通用规则：<br/>
                      为了保护隐私，WhatsApp 官方<strong>不允许</strong>网页直接控制您的手机发消息。
                      <br/>
                      <strong>但是！</strong> 我们可以配合 <strong>WhatsApp Business APP</strong> 完美解决这个问题。
                    </p>
                 </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-6 pl-2 border-l-4 border-gold-500">
              请按照以下 3 步设置，即可实现“全自动”：
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Step 1 */}
               <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-gold-500/50 transition-colors">
                  <div className="text-4xl font-bold text-zinc-800 mb-4">01</div>
                  <h4 className="text-lg font-bold text-white mb-2">下载 Business 版</h4>
                  <p className="text-sm text-slate-400 mb-4">
                    请确保您的手机安装的是 <strong>WhatsApp Business</strong> (图标里有个 B)，而不是普通的 WhatsApp。
                  </p>
                  <div className="bg-green-900/20 text-green-400 text-xs p-2 rounded border border-green-500/20 inline-block">
                     免费下载 / 资料可迁移
                  </div>
               </div>

               {/* Step 2 */}
               <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-gold-500/50 transition-colors">
                  <div className="text-4xl font-bold text-zinc-800 mb-4">02</div>
                  <h4 className="text-lg font-bold text-white mb-2">开启“自动问候”</h4>
                  <p className="text-sm text-slate-400 mb-4">
                    打开 APP {'>'} 设置 (Settings) {'>'} 商业工具 (Business Tools) {'>'} <strong>问候消息 (Greeting Message)</strong>。
                  </p>
                  <p className="text-xs text-slate-500">
                    *这会让每个第一次联系您的人，哪怕您在睡觉，都会立刻收到回复。
                  </p>
               </div>

               {/* Step 3 */}
               <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-gold-500/50 transition-colors">
                  <div className="text-4xl font-bold text-zinc-800 mb-4">03</div>
                  <h4 className="text-lg font-bold text-white mb-2">复制这段话进去</h4>
                  <div className="bg-black p-3 rounded border border-zinc-700 text-xs text-slate-300 font-mono mb-2">
                    "您好！👋 收到您的 PQG1314 代理申请了。<br/>
                    我是负责人，您的资料我们正在审核中。<br/>
                    请问您目前是全职想做，还是兼职呢？"
                  </div>
                  <p className="text-xs text-gold-500">
                    这样设置后，顾客填完表跳转过来发消息，您的手机就会自动把这段话发给他！
                  </p>
               </div>
            </div>

            <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
               <div>
                  <h4 className="font-bold text-white">关于“自动 Follow Up”</h4>
                  <p className="text-sm text-slate-400">
                    系统无法自动在第3天帮您发消息（除非付费使用 API 机器人）。<br/>
                    我们的解决方案是：您每天打开本后台的 <strong>“顾客资料表”</strong>，点击 <strong>“一键自动跟进”</strong> 按钮，系统会为您生成针对性话术，您只需点发送。
                  </p>
               </div>
               <button onClick={() => setActiveTab('leads')} className="px-6 py-3 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded-lg whitespace-nowrap">
                 去试试“一键跟进”
               </button>
            </div>
          </div>
        )}

        {/* TAB: CONTENT EDITOR */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-6">
              
              {/* NEW: Basic Settings (Phone Number) */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 border-l-4 border-l-gold-500">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gold-500" />
                  基本设置
                </h2>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    接收消息的 WhatsApp 号码
                  </label>
                  <div className="flex items-center gap-2">
                     <span className="text-lg font-bold text-gold-500">+</span>
                     <input 
                      type="text" 
                      value={editedContent.contactPhone}
                      onChange={(e) => setEditedContent({...editedContent, contactPhone: e.target.value.replace(/\D/g,'')})}
                      className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-gold-500 outline-none font-mono text-lg"
                      placeholder="60123456789"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    *请填写国际区号格式，例如马来西亚号码写 601...，新加坡写 65...<br/>
                    修改后，全站的“联系客服”和“提交报名”都会自动转到这个新号码。
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-gold-500" />
                  修改首页文字
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">主标题 (第一行)</label>
                    <input 
                      type="text" 
                      value={editedContent.heroTitle}
                      onChange={(e) => setEditedContent({...editedContent, heroTitle: e.target.value})}
                      className="w-full bg-black border border-zinc-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">副标题 (金色高亮)</label>
                    <input 
                      type="text" 
                      value={editedContent.heroSubtitle}
                      onChange={(e) => setEditedContent({...editedContent, heroSubtitle: e.target.value})}
                      className="w-full bg-black border border-zinc-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">描述文案</label>
                    <textarea 
                      rows={3}
                      value={editedContent.heroDescription}
                      onChange={(e) => setEditedContent({...editedContent, heroDescription: e.target.value})}
                      className="w-full bg-black border border-zinc-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                 <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Database className="w-5 h-5 text-gold-500" />
                  管理产品列表
                </h2>
                <p className="text-sm text-slate-500 mb-4">这些产品会显示在首页和 AI 分析提示词中。</p>
                <textarea 
                  rows={5}
                  value={editedContent.products.join('\n')}
                  onChange={(e) => setEditedContent({...editedContent, products: e.target.value.split('\n').filter(s => s.trim())})}
                  className="w-full bg-black border border-zinc-700 rounded p-2 text-white font-mono focus:border-gold-500 outline-none"
                  placeholder="每行输入一个产品"
                />
              </div>

               <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 border-gold-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
                 <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gold-400">
                  <MessageSquare className="w-5 h-5" />
                  一键跟进话术设置
                </h2>
                <p className="text-sm text-slate-500 mb-4">
                  设置点击“一键自动跟进”按钮时生成的 WhatsApp 消息内容。<br/>
                  可用代码：<code className="text-gold-500">{'{name}'}</code> 代表顾客名字，<code className="text-gold-500">{'{income}'}</code> 代表目标收入。
                </p>
                <textarea 
                  rows={4}
                  value={editedContent.followUpTemplate || ""}
                  onChange={(e) => setEditedContent({...editedContent, followUpTemplate: e.target.value})}
                  className="w-full bg-black border border-zinc-700 rounded p-2 text-white text-sm focus:border-gold-500 outline-none"
                  placeholder="请输入您的跟进话术模板..."
                />
              </div>

              <button 
                onClick={handleSaveContent}
                className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-black font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] transition-all"
              >
                <Save className="w-5 h-5" /> 保存并发布
              </button>
            </div>

            {/* Preview Hint */}
            <div className="flex flex-col justify-center items-center text-center p-8 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
               <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 text-gold-500 shadow-lg shadow-gold-900/20">
                 <ExternalLink className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-4">实时预览功能</h3>
               <p className="text-slate-400 max-w-sm mb-8">
                 您的修改会立即生效。点击左上角的返回按钮，即可看到更新后的网站。
               </p>
               <button onClick={onBack} className="text-sm text-zinc-500 hover:text-white underline">返回查看效果</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};