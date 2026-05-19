import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-6">
      <div className="max-w-md w-full font-mono">
        <div className="bg-[#0d1117] border border-border-subtle rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-[#161b22] px-4 py-2 flex items-center gap-2 border-b border-border-subtle">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-[10px] text-[#9ca3af] uppercase tracking-widest">404 — not found</span>
          </div>
          <div className="p-8 text-[13px] leading-relaxed">
            <div className="flex gap-3 mb-2">
              <span className="text-green">➜</span>
              <span className="text-accent">~</span>
              <span className="text-gray-100">cat error.log</span>
            </div>
            <pre className="whitespace-pre-wrap text-gray-400 mb-6">
{`Error: Route not found
  at resolve(path) { ... }
  Expected: valid route
  Got: something that doesn't exist`}
            </pre>
            <div className="flex gap-3 items-center mt-6 pt-4 border-t border-white/5">
              <span className="text-green">➜</span>
              <span className="text-accent">~</span>
              <Link
                href="/"
                className="text-accent hover:text-text-primary transition-colors underline underline-offset-4"
              >
                cd ~/home
              </Link>
            </div>
          </div>
        </div>
        <p className="text-center text-text-tertiary text-[11px] mt-6 tracking-widest uppercase">
          This page doesn&apos;t exist. Let&apos;s get you back.
        </p>
      </div>
    </div>
  );
}
