import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-950 px-6 pt-10 pb-8">
      <div className="mx-auto max-w-6xl">

        {/* Architectural wordmark */}
        <div className="mb-6 overflow-hidden">
          <span className="block select-none text-[5rem] font-thin leading-none tracking-tighter text-white/[0.06] md:text-[8rem]">
            myAIlogs
          </span>
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-5">
            <Link href="/terms" className="text-[11px] text-gray-600 transition-colors hover:text-gray-400">
              利用規約
            </Link>
            <Link href="/privacy" className="text-[11px] text-gray-600 transition-colors hover:text-gray-400">
              プライバシーポリシー
            </Link>
          </div>
          <p className="text-[11px] text-gray-700">
            © {new Date().getFullYear()} myAIlogs運営事務局
          </p>
        </div>

      </div>
    </footer>
  );
}
