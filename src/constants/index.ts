// ============================================
// ASHIATO.ai - Constants
// ============================================

import type {
  Industry,
  Role,
  ChallengeCategory,
  TaskCategory,
  AITool,
  Method,
  Result,
  TimeSpent,
  TechLevel,
} from '@/types';

// --- Task Category Options (AI活用タスク) ---
export const TASK_CATEGORIES: {
  value: TaskCategory;
  label: string;
  icon: string;
  color: string;
  badgeClass: string;
  example: string;
}[] = [
  {
    value: '自動化',
    label: '自動化',
    icon: '⚡',
    color: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
    badgeClass: 'bg-amber-100 text-amber-700',
    example: '問い合わせをSlackに自動投稿',
  },
  {
    value: '分析',
    label: '分析',
    icon: '📊',
    color: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    badgeClass: 'bg-purple-100 text-purple-700',
    example: '売上データから傾向を分析',
  },
  {
    value: 'ライティング',
    label: 'ライティング',
    icon: '✍️',
    color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    badgeClass: 'bg-blue-100 text-blue-700',
    example: 'ブログ記事の下書き作成',
  },
  {
    value: 'リサーチ',
    label: 'リサーチ',
    icon: '🔍',
    color: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
    badgeClass: 'bg-cyan-100 text-cyan-700',
    example: '競合サービスの調査',
  },
  {
    value: 'コーディング',
    label: 'コーディング',
    icon: '💻',
    color: 'bg-green-50 text-green-600 hover:bg-green-100',
    badgeClass: 'bg-green-100 text-green-700',
    example: '社内ツールの開発',
  },
  {
    value: 'デザイン',
    label: 'デザイン',
    icon: '🎨',
    color: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
    badgeClass: 'bg-pink-100 text-pink-700',
    example: 'プレゼン資料の作成',
  },
  {
    value: 'その他',
    label: 'その他',
    icon: '📦',
    color: 'bg-gray-50 text-gray-600 hover:bg-gray-100',
    badgeClass: 'bg-gray-100 text-gray-600',
    example: 'その他のAI活用',
  },
];

// --- Industry Options ---
export const INDUSTRIES: Industry[] = [
  'IT',
  '製造',
  '金融',
  '教育',
  '医療',
  '小売',
  '行政',
  '不動産',
  'その他',
];

// --- Role Options ---
export const ROLES: Role[] = [
  '営業',
  '人事',
  '経理',
  'マーケ',
  '企画',
  '総務',
  'エンジニア',
  'その他',
];

// --- Challenge Category Options ---
export const CHALLENGE_CATEGORIES: ChallengeCategory[] = [
  '書類作成',
  'データ分析',
  '社内ツール',
  '問合せ対応',
  'マーケティング',
  'リサーチ',
  'その他',
];

// --- AI Tool Options ---
export const AI_TOOLS: AITool[] = [
  'ChatGPT',
  'Claude',
  'Gemini',
  'Copilot',
  'Perplexity',
  'その他',
];

// --- Method Options ---
export const METHODS: Method[] = [
  'チャット',
  'Claude Code',
  'Cowork',
  'API',
  'Artifacts',
  'GPTs',
  'その他',
];

// --- Result Options ---
export const RESULTS: { value: Result; label: string; emoji: string }[] = [
  { value: 'solved', label: '解決', emoji: '✅' },
  { value: 'partial', label: '部分的に解決', emoji: '△' },
  { value: 'unsolved', label: '解決できなかった', emoji: '❌' },
];

// --- Time Spent Options ---
export const TIME_SPENT_OPTIONS: TimeSpent[] = [
  '5分以内',
  '30分以内',
  '1時間以内',
  '数時間',
  '数日',
];

// --- Tech Level Options ---
export const TECH_LEVELS: TechLevel[] = [
  '非エンジニア',
  '多少わかる',
  'エンジニア',
];

// --- Form Validation ---
export const VALIDATION = {
  WHAT_MAX_LENGTH: 50,
  GOAL_MAX_LENGTH: 100,
  CHALLENGE_SUMMARY_MAX_LENGTH: 100,
  RESULT_DETAIL_MAX_LENGTH: 400,
  PROMPT_MAX_LENGTH: 1000,
  TIPS_MAX_LENGTH: 140,
  MAX_SCREENSHOTS: 3,
} as const;

// --- Placeholder Examples ---
export const PLACEHOLDERS = {
  WHAT: '例: ユーザーからの問い合わせ',
  GOAL: '例: Slackに自動投稿＆Notionのデータベースに自動追加',
  CHALLENGE_SUMMARY: '例: 毎月の売上報告書の作成に時間がかかっていた',
  RESULT_DETAIL: '例: 報告書の8割が自動生成され、作業時間が3時間から30分に短縮',
  PROMPT: '例: 以下の音声メモを議事録にしてください。箇条書きで、決定事項と次回の宿題を最後にまとめてください。\n\n[音声メモをここに貼り付け]',
  TIPS: '例: プロンプトにテンプレートを先に渡しておくと精度が上がる',
} as const;

// --- Site Metadata ---
export const SITE_CONFIG = {
  name: 'myailogs',
  description: '「この課題、AIでこう解決した」が集まる場所',
  tagline: 'あなたの足跡が、誰かの一歩になる。',
  url: 'https://myailogs.com',
} as const;
