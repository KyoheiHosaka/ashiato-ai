import Link from 'next/link';

export function Footer() {
  return (
    <footer className="overflow-hidden bg-white px-6 pb-8 pt-24">
      <div className="mx-auto max-w-6xl">

        {/* Wordmark — same reveal rhythm as header logotype */}
        <div className="group mb-10 cursor-default select-none leading-none tracking-[-0.04em]">
          <span className="text-[4.5rem] font-thin text-gray-200 transition-colors duration-500 group-hover:text-gray-400 md:text-[7rem]">my</span>
          <span className="text-[4.5rem] font-bold text-gray-200 transition-colors duration-300 group-hover:text-emerald-400/40 md:text-[7rem]">AI</span>
          <span className="text-[4.5rem] font-thin text-gray-200 transition-colors duration-500 group-hover:text-gray-400 md:text-[7rem]">logs</span>
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-5">
            <Link href="/terms" className="group relative text-[11px] text-gray-400 transition-colors duration-300 hover:text-gray-600">
              利用規約
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/privacy" className="group relative text-[11px] text-gray-400 transition-colors duration-300 hover:text-gray-600">
              プライバシーポリシー
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
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
