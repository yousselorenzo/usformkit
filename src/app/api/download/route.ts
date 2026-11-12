import { NextResponse, type NextRequest } from 'next/server';
import { HttpError, getPaidSession, materialize } from '@/lib/fulfillment';
import { isCheckoutSessionId } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('session_id');
  if (!isCheckoutSessionId(id)) return NextResponse.json({ error: 'Invalid link.' }, { status: 400 });

  try {
    const session = await getPaidSession(id);
    const { pdf, filename } = await materialize(session);
    const inline = req.nextUrl.searchParams.get('view') === '1';
    return new NextResponse(new Uint8Array(pdf).buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  } catch (err) {
    if (err instanceof HttpError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error('[download]', err);
    return NextResponse.json({ error: 'Could not generate your document. Contact support.' }, { status: 500 });
  }
}
