import { HeaderWrapper, Footer } from '@/components/layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約 | myAIlogs',
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">利用規約</h1>

          <p className="mb-8 text-sm text-gray-500">制定日：2026年3月12日</p>

          <div className="space-y-8 text-sm leading-relaxed text-gray-700">

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">1. はじめに</h2>
              <p>
                本利用規約（以下「本規約」）は、myAIlogs運営事務局（以下「当社」）が提供する
                「myAIlogs」（以下「本サービス」）の利用条件を定めるものです。
                ユーザーは本サービスを利用することにより、本規約に同意したものとみなします。
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">2. サービスの内容</h2>
              <p>
                本サービスは、AI活用に関する体験・事例を投稿・共有・閲覧できるプラットフォームです。
                ユーザーはGoogle または X（旧Twitter）アカウントでログインすることで、
                投稿・コメント・リアクション機能を利用できます。
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">3. 禁止事項</h2>
              <p className="mb-2">ユーザーは、以下の行為を行ってはなりません。</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>法令または公序良俗に違反する行為</li>
                <li>他のユーザーまたは第三者の権利を侵害する行為</li>
                <li>虚偽の情報を投稿する行為</li>
                <li>スパム・広告目的の投稿</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>不正アクセスその他サービスへの不正な手段によるアクセス</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">4. 投稿コンテンツ</h2>
              <p className="mb-2">
                ユーザーが投稿したコンテンツの著作権はユーザー本人に帰属します。
                ただしユーザーは、当社に対して本サービスの運営・改善・宣伝のために
                当該コンテンツを無償で利用する権利を許諾するものとします。
              </p>
              <p>
                当社は、禁止事項に該当すると判断したコンテンツを、事前通知なく削除できるものとします。
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">5. 免責事項</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>本サービスはAI活用事例の情報共有を目的としており、掲載内容の正確性・有用性を保証するものではありません。</li>
                <li>本サービスの利用により生じた損害について、当社は故意または重過失がある場合を除き責任を負いません。</li>
                <li>システムメンテナンスや障害等により、予告なくサービスを停止する場合があります。</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">6. アカウントの停止</h2>
              <p>
                当社は、ユーザーが本規約に違反した場合、事前通知なくアカウントを停止・削除できるものとします。
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">7. 規約の変更</h2>
              <p>
                当社は必要に応じて本規約を変更することがあります。
                重要な変更を行う場合は、本サービス上でお知らせします。
                変更後の規約は、本ページに掲載した時点から効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">8. 準拠法・管轄</h2>
              <p>
                本規約は日本法に準拠します。本サービスに関して紛争が生じた場合、
                東京地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-semibold text-gray-900">9. お問い合わせ</h2>
              <div className="rounded-lg bg-gray-50 px-4 py-3">
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
