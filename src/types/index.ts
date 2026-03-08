// ============================================
// ASHIATO.ai - Type Definitions
// ============================================

// --- User Types ---
export interface User {
  id: string;
  display_name: string;
  avatar_url: string | null;
  provider: 'google' | 'twitter';
  created_at: string;
}

// --- Task Category (AI活用タスク) ---
export type TaskCategory =
  | '自動化'
  | '分析'
  | 'ライティング'
  | 'リサーチ'
  | 'コーディング'
  | 'デザイン'
  | 'その他';

// --- Post Types ---
export type Industry =
  | 'IT'
  | '製造'
  | '金融'
  | '教育'
  | '医療'
  | '小売'
  | '行政'
  | '不動産'
  | 'その他';

export type Role =
  | '営業'
  | '人事'
  | '経理'
  | 'マーケ'
  | '企画'
  | '総務'
  | 'エンジニア'
  | 'その他';

export type ChallengeCategory =
  | '書類作成'
  | 'データ分析'
  | '社内ツール'
  | '問合せ対応'
  | 'マーケティング'
  | 'リサーチ'
  | 'その他';

export type AITool =
  | 'ChatGPT'
  | 'Claude'
  | 'Gemini'
  | 'Copilot'
  | 'Perplexity'
  | 'その他';

export type Method =
  | 'チャット'
  | 'Claude Code'
  | 'Cowork'
  | 'API'
  | 'Artifacts'
  | 'GPTs'
  | 'その他';

export type Result = 'solved' | 'partial' | 'unsolved';

export type TimeSpent =
  | '5分以内'
  | '30分以内'
  | '1時間以内'
  | '数時間'
  | '数日';

export type TechLevel =
  | '非エンジニア'
  | '多少わかる'
  | 'エンジニア';

export interface Post {
  id: string;
  user_id: string;
  // New simple fields
  task_category: TaskCategory;
  what: string;          // 何を
  goal: string;          // どうしたかった
  ai_tools: AITool[];
  result: Result;
  prompt?: string | null; // 使ったプロンプト（任意）
  // Legacy fields (optional for backward compat)
  industry?: Industry;
  role?: Role;
  challenge_category?: ChallengeCategory;
  challenge_summary?: string;
  methods?: Method[];
  result_detail?: string | null;
  time_spent?: TimeSpent | null;
  tech_level?: TechLevel | null;
  tips?: string | null;
  is_anonymous: boolean;
  created_at: string;
  // Joined fields
  user?: User;
  screenshots?: Screenshot[];
  reaction_counts?: ReactionCounts;
}

// New simplified form data
export interface PostFormDataSimple {
  task_category: TaskCategory;
  what: string;
  goal: string;
  ai_tools: AITool[];
  result: Result;
  prompt?: string;
  is_anonymous: boolean;
}

export interface PostFormData {
  industry: Industry;
  role: Role;
  challenge_category: ChallengeCategory;
  challenge_summary: string;
  ai_tools: AITool[];
  methods: Method[];
  result: Result;
  result_detail?: string;
  time_spent?: TimeSpent;
  tech_level?: TechLevel;
  tips?: string;
  is_anonymous: boolean;
}

// --- Reaction Types ---
export type ReactionType = 'helpful' | 'same_problem';

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  type: ReactionType;
  created_at: string;
}

export interface ReactionCounts {
  helpful: number;
  same_problem: number;
}

// --- Bookmark Types ---
export interface Bookmark {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

// --- Comment Types ---
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  is_anonymous: boolean;
  created_at: string;
  user?: User;
}

// --- Screenshot Types ---
export interface Screenshot {
  id: string;
  post_id: string;
  storage_path: string;
  order: number;
}

// --- Filter Types ---
export interface PostFilters {
  task_category?: TaskCategory;
  ai_tool?: AITool;
  result?: Result;
  search?: string;
}

// --- API Response Types ---
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
