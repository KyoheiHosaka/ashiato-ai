/**
 * ASHIATO.ai シードデータ投入スクリプト
 *
 * 実行方法:
 *   node supabase/seeds/seed.mjs
 *
 * 前提条件:
 *   - .env.local に NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY が設定済み
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================
// .env.local を読み込む
// ============================================================
function loadEnv() {
  const envPath = path.resolve(__dirname, '../../.env.local');
  const raw = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が未設定です');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ============================================================
// シードデータを読み込む
// ============================================================
const tier1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'tier1_posts.json'), 'utf-8'));
const tier2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'tier2_posts.json'), 'utf-8'));
const tier3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'tier3_posts.json'), 'utf-8'));
const commentsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'comments.json'), 'utf-8'));

const allPosts = [...tier1.posts, ...tier2.posts, ...tier3.posts];
const allComments = commentsData.comments;

// ============================================================
// ユーティリティ
// ============================================================

/** 過去 daysRange 日間のランダムな日時を返す */
function randomDate(daysRange = 90) {
  const now = Date.now();
  const offset = Math.floor(Math.random() * daysRange * 24 * 60 * 60 * 1000);
  return new Date(now - offset).toISOString();
}

/** display_name から衝突しない一意のメールアドレスを生成 */
function toEmail(displayName) {
  // 日本語名でも衝突しないよう文字コードのハッシュを使う
  let hash = 0;
  for (const ch of displayName) {
    hash = (Math.imul(31, hash) + ch.charCodeAt(0)) | 0;
  }
  const hashHex = Math.abs(hash).toString(16).padStart(8, '0');
  return `seed_${hashHex}@ashiato.internal`;
}

/** ユニークな display_name の一覧を取得 */
function collectUniqueNames() {
  const names = new Set();
  for (const post of allPosts) names.add(post.display_name);
  for (const comment of allComments) names.add(comment.display_name);
  return [...names];
}

// ============================================================
// メイン処理
// ============================================================
/** Auth の全ユーザーをページネーションで取得 */
async function fetchAllAuthUsers() {
  const all = [];
  let page = 1;
  while (true) {
    const { data } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    const users = data?.users ?? [];
    all.push(...users);
    if (users.length < 1000) break;
    page++;
  }
  return all;
}

async function main() {
  console.log('🌱 ASHIATO.ai シードデータ投入開始\n');
  console.log('⚠️  前提:');
  console.log('   1. migration_v2.sql を Supabase SQL エディタで実行済み');
  console.log('   2. migration_v4_seed_compat.sql を Supabase SQL エディタで実行済み\n');

  // ----------------------------------------------------------
  // Step 0: 前回の残骸シードユーザーをクリーンアップ
  // ----------------------------------------------------------
  console.log('🧹 Step 0: 前回の残骸シードデータをクリーンアップ中...');
  const allAuthUsers = await fetchAllAuthUsers();
  const seedUsers = allAuthUsers.filter((u) => u.email?.endsWith('@ashiato.internal'));
  console.log(`   Auth上のシードユーザー: ${seedUsers.length} 名`);

  for (const u of seedUsers) {
    await supabase.auth.admin.deleteUser(u.id);
  }
  if (seedUsers.length > 0) {
    console.log(`   ✓ ${seedUsers.length} 名を削除`);
  } else {
    console.log('   (該当なし)');
  }

  // ----------------------------------------------------------
  // Step 1: ユニークユーザーを Supabase Auth に作成
  // ----------------------------------------------------------
  console.log('\n👤 Step 1: ダミーユーザーを作成中...');
  const uniqueNames = collectUniqueNames();
  console.log(`   対象: ${uniqueNames.length} 名`);

  // クリーンアップ後なので既存シードユーザーはいないはずだが念のため再取得
  const existingByEmail = {};

  /** display_name → auth user UUID のマップ */
  const userIdMap = {};

  for (const name of uniqueNames) {
    const email = toEmail(name);

    // すでに存在する場合はスキップ
    if (existingByEmail[email]) {
      userIdMap[name] = existingByEmail[email];
      console.log(`   ✓ 既存: ${name} (${existingByEmail[email].slice(0, 8)}...)`);
      continue;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: `seed_${Math.random().toString(36).slice(2)}`,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        avatar_url: null,
      },
    });

    if (error) {
      console.error(`   ❌ ユーザー作成失敗: ${name} - ${error.message}`);
      console.error(`      → Supabase SQL エディタで migration_v4_seed_compat.sql を実行してください`);
      continue;
    }

    userIdMap[name] = data.user.id;
    console.log(`   ✓ 作成: ${name} (${data.user.id.slice(0, 8)}...)`);
  }

  // ----------------------------------------------------------
  // Step 2: public.users にプロフィールを upsert
  // ----------------------------------------------------------
  console.log('\n📋 Step 2: プロフィールを登録中...');

  const userRecords = Object.entries(userIdMap).map(([name, id]) => ({
    id,
    display_name: name,
    avatar_url: null,
    provider: 'google',
  }));

  const { error: upsertError } = await supabase
    .from('users')
    .upsert(userRecords, { onConflict: 'id' });

  if (upsertError) {
    console.error('❌ プロフィール登録エラー:', upsertError.message);
  } else {
    console.log(`   ✓ ${userRecords.length} 件のプロフィールを登録`);
  }

  // ----------------------------------------------------------
  // Step 3: 投稿を挿入
  // ----------------------------------------------------------
  console.log('\n📝 Step 3: 投稿を挿入中...');

  /** seed ID ("seed-t1-001" 等) → 実 post UUID のマップ */
  const postIdMap = {};

  for (const post of allPosts) {
    const userId = userIdMap[post.display_name];
    if (!userId) {
      console.warn(`   ⚠️  ユーザーが見つかりません: ${post.display_name}`);
      continue;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        task_category: post.task_category,
        what: post.what,
        goal: post.goal,
        ai_tools: post.ai_tools,
        result: post.result,
        result_detail: post.result_detail || null,
        is_anonymous: post.is_anonymous,
        created_at: randomDate(90),
      })
      .select('id')
      .single();

    if (error) {
      console.error(`   ❌ 投稿失敗: ${post.id} - ${error.message}`);
      continue;
    }

    postIdMap[post.id] = data.id;
    console.log(`   ✓ ${post.id} → ${data.id.slice(0, 8)}... (${post.display_name})`);
  }

  // ----------------------------------------------------------
  // Step 4: コメントを挿入
  // ----------------------------------------------------------
  console.log('\n💬 Step 4: コメントを挿入中...');

  for (const comment of allComments) {
    const postId = postIdMap[comment.post_id];
    const userId = userIdMap[comment.display_name];

    if (!postId) {
      console.warn(`   ⚠️  投稿が見つかりません: ${comment.post_id}`);
      continue;
    }
    if (!userId) {
      console.warn(`   ⚠️  ユーザーが見つかりません: ${comment.display_name}`);
      continue;
    }

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: userId,
      body: comment.content,
      is_anonymous: comment.is_anonymous,
      created_at: randomDate(60),
    });

    if (error) {
      console.error(`   ❌ コメント失敗: ${comment.post_id} - ${error.message}`);
    } else {
      console.log(`   ✓ ${comment.post_id} へのコメント (${comment.display_name})`);
    }
  }

  // ----------------------------------------------------------
  // 完了
  // ----------------------------------------------------------
  console.log('\n✅ シードデータ投入完了!');
  console.log(`   ユーザー: ${Object.keys(userIdMap).length} 名`);
  console.log(`   投稿: ${Object.keys(postIdMap).length} 件`);
  console.log(`   コメント: ${allComments.length} 件`);
}

main().catch((err) => {
  console.error('予期しないエラー:', err);
  process.exit(1);
});
