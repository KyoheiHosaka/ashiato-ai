# シードデータ

ASHIATO.aiの初期データ（シード投稿）です。

## ファイル構成

| ファイル | 件数 | 説明 |
|---------|------|------|
| `tier1_posts.json` | 25件 | Tier1ユーザー（主婦、建設業、飲食店など） |
| `tier2_posts.json` | 15件 | Tier2ユーザー（事務職、営業、学生、フリーランスなど） |
| `tier3_posts.json` | 10件 | Tier3ユーザー（エンジニア、スタートアップなど） |
| `comments.json` | 13件 | 投稿へのコメント（成功へのアドバイス） |

## ターゲットペルソナ

### Tier1（50%）- Tech savvyではない一般ユーザー
- PTA役員、町内会役員
- 建設会社・塗装会社の事務や社長
- 飲食店の店長、シフト管理者
- 保育園・学童保育のスタッフ
- 小規模店舗のオーナー

### Tier2（30%）- 非エンジニアの知識労働者
- 一般企業の事務職・営業職
- 大学生・大学院生
- フリーランス（翻訳者、デザイナーなど）
- 動画投稿者
- 政治家秘書

### Tier3（20%）- IT/テック系
- スタートアップ社員
- エンジニア
- プロダクトマネージャー
- データサイエンティスト

## 使い方

### 1. JSONファイルを読み込んでSupabaseに投入

```javascript
const tier1 = require('./tier1_posts.json');
const tier2 = require('./tier2_posts.json');
const tier3 = require('./tier3_posts.json');
const comments = require('./comments.json');

// 全投稿を結合
const allPosts = [
  ...tier1.posts,
  ...tier2.posts,
  ...tier3.posts
];
```

### 2. 投入前の準備

1. シードユーザーを先に作成（または匿名投稿として投入）
2. `id`フィールドはUUIDに変換するか、自動生成させる
3. `created_at`は適当な日時を設定（ランダムに分散させると自然）

### 3. 投入順序

1. ユーザーデータ（必要な場合）
2. 投稿データ（posts）
3. コメントデータ（comments）
4. リアクションデータ（任意）

## 注意事項

- `is_anonymous: true`の投稿は匿名として扱う
- `result_detail`は400文字以内
- `what`は50文字以内、`goal`は100文字以内
