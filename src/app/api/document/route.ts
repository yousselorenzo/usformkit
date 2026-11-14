import { NextResponse } from 'next/server';
import { buildDocument } from '@/lib/documents';
import { renderPdf } from '@/lib/pdf/render';
import { isDocType } from '@/lib/products';
import { SCHEMAS, issuesToErrors } from '@/lib/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY = 60_000;

/** Renders the clean PDF from validated form answers. Needs no Stripe keys or env vars. */
export async function POST(req: Request) {
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) return NextResponse.json({ error: 'Request too large.' }, { status: 413 });

    let body: { docType?: unknown; data?: unknown; reference?: unknown };
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }
    if (!isDocType(body.docType)) return NextResponse.json({ error: 'Unknown document.' }, { status: 400 });

    const docType = body.docType;
    const parsed = SCHEMAS[docType].safeParse(body.data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Some answers are invalid.', fields: issuesToErrors(parsed.error) },
        { status: 422 },
      );
    }

    const reference =
      typeof body.reference === 'string' ? body.reference.replace(/[^A-Za-z0-9]/g, '').slice(-10).toUpperCase() : '';
    const model = buildDocument(docType, parsed.data, { preview: false });
    const pdf = await renderPdf(model, reference ? { reference } : {});
    return new NextResponse(new Uint8Array(pdf).buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  } catch (err) {
    console.error('[document]', err);
    return NextResponse.json({ error: 'Could not generate your document.' }, { status: 500 });
  }
}
