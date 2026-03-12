import Link from 'next/link';

export function Footer() {
  return (
    <footer className="overflow-hidden bg-white px-6 pb-8 pt-24">
      <div className="mx-auto max-w-6xl">

        {/* Typographic anchor — weight contrast at scale */}
        <div className="mb-10 leading-none tracking-[-0.04em] select-none">
          <span className="text-[4.5rem] font-thin text-gray-200 md:text-[7rem]">my</span>
          <span className="text-[4.5rem] font-bold text-gray-200 md:text-[7rem]">AI</span>
          <span className="text-[4.5rem] font-thin text-gray-200 md:text-[7rem]">logs</span>
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-5">
            <Link href="/terms" className="text-[11px] text-gray-400 transition-colors hover:text-gray-600">
              利用規約
            </Link>
            <Link href="/privacy" className="text-[11px] text-gray-400 transition-colors hover:text-gray-600">
              プライバシーポリシー
            </Link>
          </div>
          <p className="text-[11px] text-gray-300">
            © {new Date().getFullYear()} myAIlogs運営事務局
          </p>
        </div>

      </div>
    </footer>
  );
}
