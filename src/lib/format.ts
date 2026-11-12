export const BLANK = '__________';

export const val = (s: string | undefined | null, fallback = BLANK) => {
  const t = (s ?? '').trim();
  return t.length ? t : fallback;
};

export function money(s: string | undefined): string {
  const clean = String(s ?? '').replace(/[^0-9.]/g, '');
  const n = Number(clean);
  if (!clean || Number.isNaN(n)) return `$${BLANK}`;
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function longDate(s: string | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s ?? ''));
  if (!m) return BLANK;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const digits = (s: string | undefined) => String(s ?? '').replace(/\D/g, '');

export function formatTin(tin: string, type: 'ssn' | 'ein'): string {
  const d = digits(tin);
  if (d.length !== 9) return d || BLANK;
  return type === 'ssn' ? `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}` : `${d.slice(0, 2)}-${d.slice(2)}`;
}

export function maskTin(tin: string, type: 'ssn' | 'ein'): string {
  const d = digits(tin);
  if (!d) return BLANK;
  const last = d.slice(-4).padStart(Math.min(4, d.length), '•');
  return type === 'ssn' ? `•••-••-${last}` : `••-•••${last}`;
}

export const todayISO = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
