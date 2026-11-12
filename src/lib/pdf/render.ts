import 'server-only';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import type { Block, DocModel } from '../documents/types';
import { SITE } from '../site';

const W = 612; // US Letter
const H = 792;
const M = 56;
const CW = W - M * 2;
const FOOTER = 48;

const NAVY = rgb(0.055, 0.11, 0.21);
const SLATE = rgb(0.39, 0.45, 0.55);
const LINE = rgb(0.86, 0.88, 0.91);
const TEXT = rgb(0.1, 0.12, 0.16);
const TINT = rgb(0.96, 0.97, 0.985);

/** Standard PDF fonts only support WinAnsi; normalise everything else. */
export function sanitize(s: string): string {
  return s
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—−]/g, '-')
    .replace(/…/g, '...')
    .replace(/[•·]/g, '-')
    .replace(/[ \t]/g, ' ')
    .replace(/[^\n\x20-\x7E\xA1-\xFF]/g, '');
}

function wrap(text: string, font: PDFFont, size: number, max: number): string[] {
  const out: string[] = [];
  for (const para of sanitize(text).split('\n')) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) {
      out.push('');
      continue;
    }
    let line = '';
    for (let w of words) {
      // Hard-break words longer than the line (e.g. long URLs).
      while (font.widthOfTextAtSize(w, size) > max) {
        let i = w.length;
        while (i > 1 && font.widthOfTextAtSize(w.slice(0, i), size) > max) i--;
        if (line) {
          out.push(line);
          line = '';
        }
        out.push(w.slice(0, i));
        w = w.slice(i);
      }
      if (!w) continue;
      const next = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(next, size) <= max) line = next;
      else {
        if (line) out.push(line);
        line = w;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

type Fonts = { regular: PDFFont; bold: PDFFont; italic: PDFFont };

class Writer {
  page!: PDFPage;
  y = 0;
  constructor(
    private doc: PDFDocument,
    public f: Fonts,
  ) {
    this.addPage();
  }
  addPage() {
    this.page = this.doc.addPage([W, H]);
    this.y = H - M;
  }
  ensure(h: number) {
    if (this.y - h < M + FOOTER) this.addPage();
  }
  draw(text: string, x: number, y: number, size: number, font: PDFFont, color = TEXT) {
    this.page.drawText(sanitize(text), { x, y, size, font, color });
  }
  lines(
    text: string,
    o: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; x?: number; width?: number; lh?: number } = {},
  ) {
    const size = o.size ?? 10;
    const font = o.font ?? this.f.regular;
    const lh = o.lh ?? size * 1.45;
    for (const l of wrap(text, font, size, o.width ?? CW)) {
      this.ensure(lh);
      this.y -= lh;
      if (l) this.draw(l, o.x ?? M, this.y, size, font, o.color ?? TEXT);
    }
  }
  centered(text: string, size: number, font: PDFFont, color = TEXT) {
    for (const l of wrap(text, font, size, CW)) {
      this.y -= size * 1.35;
      this.draw(l, (W - font.widthOfTextAtSize(l, size)) / 2, this.y, size, font, color);
    }
  }
}

function renderBlock(w: Writer, b: Block) {
  const { regular, bold, italic } = w.f;
  switch (b.type) {
    case 'heading': {
      w.ensure(40);
      w.y -= 10;
      w.lines(b.text, { size: 11, font: bold, color: NAVY, lh: 15 });
      w.y -= 3;
      return;
    }
    case 'paragraph': {
      w.lines(b.text, { size: 10 });
      w.y -= 5;
      return;
    }
    case 'fields': {
      const colW = (CW - 20) / 2;
      const rows = b.rows;
      for (let i = 0; i < rows.length; i += 2) {
        const pair = rows.slice(i, i + 2);
        // A long value takes the full width.
        const full = pair.some((r) => regular.widthOfTextAtSize(sanitize(r.value), 10) > colW) || pair.length === 1;
        const cells = full ? pair.map((r) => ({ r, w: CW })) : pair.map((r) => ({ r, w: colW }));
        const groups = full ? cells.map((c) => [c]) : [cells];
        for (const g of groups) {
          const measured = g.map(({ r, w: cw }) => ({
            label: wrap(r.label.toUpperCase(), bold, 7, cw),
            value: wrap(r.value, regular, 10, cw),
            cw,
          }));
          const h = Math.max(...measured.map((m) => m.label.length * 9 + m.value.length * 13)) + 6;
          w.ensure(h + 4);
          measured.forEach((m, idx) => {
            const x = M + idx * (colW + 20);
            let y = w.y;
            for (const l of m.label) {
              y -= 9;
              w.draw(l, x, y, 7, bold, SLATE);
            }
            for (const l of m.value) {
              y -= 13;
              w.draw(l, x, y, 10, regular);
            }
            w.page.drawLine({
              start: { x, y: w.y - h },
              end: { x: x + m.cw, y: w.y - h },
              thickness: 0.6,
              color: LINE,
            });
          });
          w.y -= h + 6;
        }
      }
      w.y -= 2;
      return;
    }
    case 'checklist': {
      for (const item of b.items) {
        const ls = wrap(item.label, regular, 10, CW - 18);
        w.ensure(ls.length * 14 + 4);
        ls.forEach((l, i) => {
          w.y -= 14;
          if (i === 0) {
            w.page.drawRectangle({
              x: M,
              y: w.y - 1.5,
              width: 9,
              height: 9,
              borderColor: NAVY,
              borderWidth: 0.8,
            });
            if (item.checked) w.draw('X', M + 1.6, w.y - 0.2, 8.5, bold, NAVY);
          }
          w.draw(l, M + 18, w.y, 10, regular);
        });
        w.y -= 3;
      }
      w.y -= 4;
      return;
    }
    case 'signatures': {
      const colW = (CW - 30) / 2;
      for (let i = 0; i < b.parties.length; i += 2) {
        w.ensure(86);
        w.y -= 40;
        b.parties.slice(i, i + 2).forEach((p, idx) => {
          const x = M + idx * (colW + 30);
          w.page.drawLine({ start: { x, y: w.y }, end: { x: x + colW, y: w.y }, thickness: 0.8, color: TEXT });
          w.draw(`Signature - ${p.role}`, x, w.y - 11, 7.5, bold, SLATE);
          w.draw(`Printed name: ${p.name}`, x, w.y - 25, 9, regular);
          w.draw(`Date: ${p.date ?? '____________________'}`, x, w.y - 39, 9, regular);
        });
        w.y -= 46;
      }
      return;
    }
    case 'note': {
      const ls = wrap(b.text, italic, 8.5, CW - 20);
      const h = ls.length * 12 + 12;
      w.ensure(h + 10);
      w.y -= 8;
      w.page.drawRectangle({ x: M, y: w.y - h, width: CW, height: h, color: TINT });
      let y = w.y - 4;
      for (const l of ls) {
        y -= 12;
        w.draw(l, M + 10, y, 8.5, italic, SLATE);
      }
      w.y -= h + 6;
      return;
    }
  }
}

export async function renderPdf(model: DocModel, meta: { reference?: string } = {}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fonts: Fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    italic: await doc.embedFont(StandardFonts.HelveticaOblique),
  };
  doc.setTitle(model.title);
  doc.setAuthor(SITE.name);
  doc.setCreator(`${SITE.name} (${SITE.domain})`);
  doc.setProducer(SITE.name);
  doc.setCreationDate(new Date());

  const w = new Writer(doc, fonts);

  // Header
  w.draw('US FORM KIT', M, H - M + 14, 7.5, fonts.bold, SLATE);
  if (meta.reference) {
    const ref = `Ref. ${meta.reference}`;
    w.draw(ref, W - M - fonts.regular.widthOfTextAtSize(ref, 7.5), H - M + 14, 7.5, fonts.regular, SLATE);
  }
  w.y -= 6;
  w.centered(model.title, 18, fonts.bold, NAVY);
  if (model.subtitle) {
    w.y -= 2;
    w.centered(model.subtitle, 10, fonts.regular, SLATE);
  }
  w.y -= 12;
  w.page.drawLine({ start: { x: M, y: w.y }, end: { x: W - M, y: w.y }, thickness: 1.2, color: NAVY });
  w.y -= 4;

  for (const block of model.blocks) renderBlock(w, block);

  // Footer on every page
  const pages = doc.getPages();
  const disclaimer = sanitize(SITE.disclaimer);
  pages.forEach((page, i) => {
    page.drawLine({ start: { x: M, y: M + 6 }, end: { x: W - M, y: M + 6 }, thickness: 0.5, color: LINE });
    page.drawText(`${SITE.name} | ${SITE.domain}`, { x: M, y: M - 6, size: 7.5, font: fonts.bold, color: SLATE });
    const pn = `Page ${i + 1} of ${pages.length}`;
    page.drawText(pn, {
      x: W - M - fonts.regular.widthOfTextAtSize(pn, 7.5),
      y: M - 6,
      size: 7.5,
      font: fonts.regular,
      color: SLATE,
    });
    page.drawText(disclaimer, { x: M, y: M - 17, size: 6.5, font: fonts.regular, color: SLATE, maxWidth: CW });
  });

  return doc.save();
}
