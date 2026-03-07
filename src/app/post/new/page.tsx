import { HeaderWrapper, Footer } from '@/components/layout';
import { SimplePostForm } from '@/components/post/simple-post-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '足跡を残す',
  description: 'AI活用の成功・失敗体験を共有しましょう',
};

export default function NewPostPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              足跡を残す
            </h1>
            <p className="mt-1 text-gray-500">
              AI活用体験をシェアしよう
            </p>
          </div>
          <SimplePostForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
