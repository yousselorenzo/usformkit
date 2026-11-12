import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'US Form Kit — Bill of Sale, W-9 and Lease Agreement generator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #081124 0%, #16294B 100%)',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 32, fontWeight: 700 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#fff', display: 'flex' }} />
          US Form Kit
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5 }}>
            US legal &amp; tax forms, done right in minutes.
          </div>
          <div style={{ fontSize: 30, color: '#C3CFE3' }}>Bill of Sale · W-9 · Residential Lease Agreement</div>
        </div>
        <div style={{ fontSize: 24, color: '#94A8CB' }}>usformkit.com</div>
      </div>
    ),
    size,
  );
}
