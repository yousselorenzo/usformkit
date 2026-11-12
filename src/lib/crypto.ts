import 'server-only';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { deflateRawSync, inflateRawSync } from 'node:zlib';

function key(): Buffer {
  const secret = process.env.DOCUMENT_ENCRYPTION_KEY;
  if (!secret || secret.length < 32) {
    throw new Error('DOCUMENT_ENCRYPTION_KEY must be set to at least 32 characters.');
  }
  return createHash('sha256').update(secret).digest();
}

/** Compress + AES-256-GCM encrypt. Output is base64url: iv(12) | tag(16) | ciphertext. */
export function sealPayload(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const enc = Buffer.concat([cipher.update(deflateRawSync(Buffer.from(plain, 'utf8'))), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), enc]).toString('base64url');
}

export function openPayload(token: string): string {
  const buf = Buffer.from(token, 'base64url');
  if (buf.length < 29) throw new Error('Invalid payload');
  const decipher = createDecipheriv('aes-256-gcm', key(), buf.subarray(0, 12));
  decipher.setAuthTag(buf.subarray(12, 28));
  const dec = Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]);
  return inflateRawSync(dec).toString('utf8');
}

/** Stripe metadata: max 50 keys, 500 chars per value. Reserve a few keys for our own use. */
const CHUNK = 490;
const MAX_CHUNKS = 44;

export function toMetadata(token: string): Record<string, string> {
  const chunks = token.match(new RegExp(`.{1,${CHUNK}}`, 'g')) ?? [];
  if (chunks.length > MAX_CHUNKS) throw new Error('Document is too large. Please shorten long text fields.');
  const meta: Record<string, string> = { p_count: String(chunks.length) };
  chunks.forEach((c, i) => (meta[`p${i}`] = c));
  return meta;
}

export function fromMetadata(meta: Record<string, string> | null | undefined): string {
  const count = Number(meta?.p_count ?? 0);
  if (!meta || !count) throw new Error('No document attached to this order.');
  let out = '';
  for (let i = 0; i < count; i++) out += meta[`p${i}`] ?? '';
  return out;
}
