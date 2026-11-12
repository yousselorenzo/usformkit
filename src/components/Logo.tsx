import Link from 'next/link';

export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#0E1C36" />
      <path d="M10 8h8.5L23 12.5V24H10z" fill="#fff" />
      <path d="M18.5 8v4.5H23" fill="#C3CFE3" />
      <path d="M13 16h7M13 19.5h5" stroke="#0E1C36" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-navy-700/15" aria-label="US Form Kit home">
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-tight text-navy-950">
        US Form Kit
      </span>
    </Link>
  );
}
