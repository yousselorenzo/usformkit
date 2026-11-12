'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconClose, IconMenu } from './Icons';
import { Logo } from './Logo';

const NAV = [
  { href: '/bill-of-sale', label: 'Bill of Sale' },
  { href: '/w9-form', label: 'W-9' },
  { href: '/lease-agreement', label: 'Lease' },
  { href: '/guides', label: 'Guides' },
  { href: '/sources', label: 'Sources' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? 'bg-navy-50 text-navy-900' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <Link href="/#documents" className="btn-primary ml-3 h-10 px-4 text-sm">
            Create a document
          </Link>
        </nav>
        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-xl text-navy-900 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose width={22} height={22} /> : <IconMenu width={22} height={22} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-50 bg-white md:hidden">
          <nav className="container-x flex flex-col gap-1 py-4" aria-label="Mobile">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex h-14 items-center rounded-xl px-3 text-lg font-medium text-navy-950 active:bg-slate-100"
              >
                {n.label}
              </Link>
            ))}
            <Link href="/#documents" className="btn-primary mt-4 w-full">
              Create a document
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
