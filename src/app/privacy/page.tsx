import { HeaderWrapper, Footer } from '@/components/layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | myAIlogs',
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">プライバシーポリシー</h1>

          <p className="mb-8 text-sm text-gray-500">制定日：2026年3月12日</p>

          <div className="space-y-8 text-sm leading-relaxed text-gray-700">

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">1. 事業者情報</h2>
              <p>
                myAIlogs運営事務局（以下「当社」）は、本サービス「myAIlogs」（以下「本サービス」）における
                個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">2. 取得する個人情報</h2>
              <p className="mb-2">本サービスでは、以下の情報を取得します。</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>メールアドレス</li>
                <li>表示名（氏名またはニックネーム）</li>
                <li>プロフィール画像</li>
                <li>本サービスへの投稿内容・コメント・リアクション</li>
                <li>アクセスログ（IPアドレス、ブラウザ情報等）</li>
              </ul>
              <p className="mt-2">
                上記の情報は、GoogleのOAuth認証を通じて取得します。
                認証時に取得する情報の範囲はGoogleの仕様に従います。
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">3. 利用目的</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>本サービスの提供・運営・改善</li>
                <li>ユーザーの識別・認証</li>
                <li>お問い合わせへの対応</li>
                <li>利用規約違反等への対応</li>
                <li>サービスの利用状況の分析</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">4. 第三者提供</h2>
              <p className="mb-3">
                当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>ユーザー本人の同意がある場合</li>
                <li>法令に基づく場合</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">5. 外国にある第三者への提供</h2>
              <p className="mb-2">
                本サービスの運営にあたり、以下の外国事業者にデータを提供します。
                なお、これらへの提供はサービス提供のための業務委託として行われます。
              </p>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">事業者</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">所在国</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">用途</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-2">Supabase, Inc.</td>
                      <td className="px-4 py-2">米国</td>
                      <td className="px-4 py-2">認証・データベース</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Vercel, Inc.</td>
                      <td className="px-4 py-2">米国</td>
                      <td className="px-4 py-2">ホスティング</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                各社の個人情報保護体制については、各社のプライバシーポリシーをご参照ください。
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">6. 保有個人データの開示・訂正・削除</h2>
              <p>
                ユーザーご本人は、当社が保有する個人情報の開示・訂正・削除・利用停止を請求することができます。
                請求は下記のお問い合わせ先までメールにてご連絡ください。本人確認のうえ、
                合理的な期間内に対応いたします。
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">7. Cookieの使用</h2>
              <p>
                本サービスでは、ログイン状態の維持のためにCookieを使用します。
                ブラウザの設定によりCookieを無効にすることができますが、
                その場合、本サービスの一部機能が利用できなくなる場合があります。
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">8. プライバシーポリシーの変更</h2>
              <p>
                当社は、必要に応じて本ポリシーを変更することがあります。
                重要な変更を行う場合は、本サービス上でお知らせします。
                変更後のポリシーは、本ページに掲載した時点から効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">9. お問い合わせ</h2>
              <p>
                個人情報の取り扱いに関するご質問・ご要望は、以下までお問い合わせください。
              </p>
              <div className="mt-2 rounded-lg bg-gray-50 px-4 py-3">
                <p className="font-medium text-gray-800">myAIlogs運営事務局</p>
                <p className="mt-1">
                  メール：
                  <a href="mailto:pactly.office@gmail.com" className="text-emerald-600 hover:underline">
                    pactly.office@gmail.com
                  </a>
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
