'use client';

import type { Block, DocModel } from '@/lib/documents/types';

const WATERMARK = 'PREVIEW ONLY - COMPLETE PAYMENT TO UNLOCK';
const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='440' height='240'><text x='220' y='120' text-anchor='middle' dominant-baseline='middle' transform='rotate(-28 220 120)' font-family='Arial, Helvetica, sans-serif' font-size='15' font-weight='700' letter-spacing='1' fill='rgba(14,28,54,0.17)'>${WATERMARK}</text></svg>`;
const watermarkBg = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case 'heading':
      return (
        <h3 className="mb-2 mt-6 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-navy-900">{b.text}</h3>
      );
    case 'paragraph':
      return <p className="mb-3 whitespace-pre-line">{b.text}</p>;
    case 'fields':
      return (
        <dl className="mb-4 grid grid-cols-1 gap-x-6 gap-y-2.5 font-sans sm:grid-cols-2">
          {b.rows.map((r) => (
            <div key={r.label} className="border-b border-slate-200 pb-1.5">
              <dt className="text-[9.5px] font-semibold uppercase tracking-wide text-slate-500">{r.label}</dt>
              <dd className="break-words text-[13px] text-slate-900">{r.value}</dd>
            </div>
          ))}
        </dl>
      );
    case 'checklist':
      return (
        <ul className="mb-4 space-y-2">
          {b.items.map((it) => (
            <li key={it.label} className="flex gap-2.5">
              <span
                className="mt-[3px] inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center border border-navy-900 font-sans text-[10px] font-bold leading-none text-navy-900"
                aria-label={it.checked ? 'checked' : 'unchecked'}
              >
                {it.checked ? 'X' : ''}
              </span>
              <span>{it.label}</span>
            </li>
          ))}
        </ul>
      );
    case 'signatures':
      return (
        <div className="mb-4 mt-6 grid grid-cols-1 gap-6 font-sans sm:grid-cols-2">
          {b.parties.map((p, i) => (
            <div key={`${p.role}-${i}`}>
              <div className="h-8 border-b border-slate-800" />
              <p className="mt-1 text-[9.5px] font-semibold uppercase tracking-wide text-slate-500">Signature - {p.role}</p>
              <p className="text-[12px] text-slate-800">Printed name: {p.name}</p>
              <p className="text-[12px] text-slate-800">Date: {p.date ?? '____________'}</p>
            </div>
          ))}
        </div>
      );
    case 'note':
      return <p className="my-4 rounded bg-slate-50 px-3 py-2 font-sans text-[11px] italic leading-relaxed text-slate-500">{b.text}</p>;
  }
}

export function DocumentPreview({ doc }: { doc: DocModel }) {
  return (
    <div
      className="no-print select-none rounded-2xl border border-slate-200 bg-slate-100/80 p-2.5 sm:p-4"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="mb-2.5 flex items-center justify-between px-1 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live preview
        </span>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-800 ring-1 ring-amber-200">Watermarked</span>
      </div>

      <div className="max-h-[72vh] overflow-y-auto overscroll-contain rounded-md bg-white shadow-lg ring-1 ring-slate-200">
        <article className="relative px-5 py-7 font-serif text-[13px] leading-relaxed text-slate-800 sm:px-10 sm:py-10" aria-label="Document preview">
          <header className="mb-5 border-b-2 border-navy-900 pb-4 text-center font-sans">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">US Form Kit</p>
            <h2 className="mt-1 text-lg font-bold text-navy-950 sm:text-xl">{doc.title}</h2>
            {doc.subtitle && <p className="mt-0.5 text-[12px] text-slate-500">{doc.subtitle}</p>}
          </header>
          {doc.blocks.map((b, i) => (
            <BlockView key={i} b={b} />
          ))}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ backgroundImage: watermarkBg }} />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 z-10 flex justify-center">
            <span className="rotate-[-12deg] rounded-md border-2 border-red-500/40 bg-white/60 px-3 py-1 font-sans text-[11px] font-bold tracking-[0.18em] text-red-600/70 backdrop-blur-[1px] sm:text-xs">
              {WATERMARK}
            </span>
          </div>
        </article>
      </div>
    </div>
  );
}
