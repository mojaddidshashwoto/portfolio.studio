import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-6 py-32 bg-[#0a0a0a] text-[#f2f2f2]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="font-mono text-xs uppercase tracking-widest text-[#c6ff3d]">
          404 // FRAME NOT FOUND
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-extrabold uppercase tracking-tight text-[#f2f2f2]">
          Missing View
        </h1>
        <p className="text-sm text-neutral-400 font-light leading-relaxed">
          The requested photograph or page does not exist in this archive. Return to the main gallery index.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#c6ff3d] bg-[#c6ff3d] text-[#0a0a0a] font-mono font-bold text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#c6ff3d] transition-colors"
          >
            <span>Return to Archive</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
