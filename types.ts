export interface AgentApplication {
  name: string;
  phone: string;
  location: string;
  reason: string;
  incomeGoal: string;
  date?: string;
  aiScore?: number;
  aiRole?: string;
  status?: 'new' | 'contacted' | 'joined';
}

export interface AnalysisResult {
  score: number;
  feedback: string;
  suggestedRole: string;
}

export interface SiteContent {
  contactPhone: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  products: string[];
  followUpTemplate: string;
}

export const DEFAULT_CONTENT: SiteContent = {
  contactPhone: "60167635402",
  heroTitle: "与 PQG1314 一起",
  heroSubtitle: "经营事业 · 收获财富",
  heroDescription: "只需一部手机，无需大量囤货，系统化培训带您月入过万！我们拥有丰富的产品线与完善的晋升制度。",
  products: [
    "保健品", "护肤品", "日常用品", 
    "咖啡", "可可", "姜茶", "新年饼", 
    "未来持续开发新项目..."
  ],
  followUpTemplate: "Hi {name}，我是 PQG1314 的负责人。我刚在系统后台看到您的报名资料。您填写的收入目标是 {income}，我们正好有一套模式可以帮您达成。请问现在方便通个电话，还是我发资料给您看看？"
};

export const LOCATIONS = [
  "吉隆坡 / 雪兰莪 (KL/Selangor)",
  "柔佛 (Johor)",
  "槟城 (Penang)",
  "霹雳 (Perak)",
  "沙巴 / 砂拉越 (Sabah/Sarawak)",
  "其他地区 (Other)"
];

export const INCOME_GOALS = [
  "RM 1,000 - RM 3,000 (兼职赚外快)",
  "RM 3,000 - RM 8,000 (全职发展)",
  "RM 8,000 - RM 15,000 (冲刺高薪)",
  "RM 15,000+ (建立团队/领导层)"
];