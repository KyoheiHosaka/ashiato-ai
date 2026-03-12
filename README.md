This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 開発上の注意事項・過去の失敗と教訓

### 認証（Supabase Auth / `@supabase/ssr`）

#### 教訓1: `getSession()` エラー時に `signOut()` を呼んではいけない

**何をしたか**

過去の認証バグで壊れたセッションクッキーが残ったユーザーが、ページを開くたびに事例一覧のスピナーが止まらない問題が発生した。原因は Supabase クライアントが無効なリフレッシュトークンのリフレッシュを試み続けてクエリがスタックするためだった。

この問題を解消するため、`useAuth` の `initializeAuth` に以下の処理を追加した：

```typescript
const { data: { session }, error } = await supabase.auth.getSession();
if (error) {
  await supabase.auth.signOut(); // ← これが問題
  setState({ user: null, ... });
}
```

**何が起きたか**

OAuth ログイン完了直後（Google認証 → `/auth/callback` → ホームへリダイレクト）のシークレットモードで、アバターが更新されずログインできない状態になった。

**なぜ起きたか**

`@supabase/ssr` の PKCE フローでは、コールバックがHTTPクッキーにセッションを書き込んだ後、ブラウザクライアントがそれをインメモリ状態へ同期する過渡的なタイミングが存在する。この瞬間に `getSession()` がエラーを返すことがあり、そこで `signOut()` を呼ぶと正常なセッションまでクリアされてしまう。

**なぜリスク評価で見落としたか**

「どんな種類のエラーが `getSession()` から返るか（ネットワーク障害 vs 壊れたデータ）」という軸でしかリスクを評価しなかった。「OAuthで今まさに確立されようとしているセッション」という**時間軸のシナリオ**を考慮できていなかった。

**教訓・再発防止**

- `signOut()` はユーザーが明示的にログアウトを要求した場合にのみ呼ぶ。エラーハンドリングの中で自動的に呼んではいけない。
- 認証まわりの変更は、必ずシークレットモード（クリーンな状態）でOAuthログインフローを最初から最後まで通してテストする。
- リスク評価をするときは「エラーの種類」だけでなく「ユーザーフローの各タイミング（特に状態遷移の過渡期）」も明示的に検討する。
- `@supabase/ssr` のブラウザクライアントはクッキーとインメモリ状態の同期に非同期のタイミングがある。この同期が完了する前に `getSession()` が呼ばれると予期しない結果になることがある。

**正しい実装**

```typescript
// エラーが返っても signOut() は呼ばない。状態をリセットするだけ。
try {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    // ...
  } else {
    setState({ user: null, supabaseUser: null, session: null, isLoading: false });
  }
} catch {
  setState({ user: null, supabaseUser: null, session: null, isLoading: false });
}
```

---

#### 教訓2: ミドルウェアで `/auth/callback` に `updateSession` を実行してはいけない

`updateSession`（`supabase.auth.getUser()` 経由）をミドルウェアで `/auth/callback` に対しても実行すると、PKCE の `code_verifier` クッキーが消費され、その後のルートハンドラでの `exchangeCodeForSession` が失敗して `?error=auth_failed` になる。

```typescript
// middleware.ts
if (pathname === '/auth/callback') {
  return NextResponse.next(); // updateSession をスキップする
}
return await updateSession(request);
```

---

#### 教訓3: `NEXT_PUBLIC_` 環境変数はデプロイ時にビルドへ焼き込まれる

`NEXT_PUBLIC_` プレフィックス付きの環境変数は、ビルド時に静的に埋め込まれる。Vercel で追加・変更した場合は**再デプロイ**しないと反映されない。ランタイムで動的に読まれるサーバーサイド変数（`ADMIN_EMAIL` など）とは異なる挙動に注意。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
