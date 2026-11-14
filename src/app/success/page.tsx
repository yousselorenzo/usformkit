import type { Metadata } from 'next';
import { SuccessClient } from '@/components/SuccessClient';

export const metadata: Metadata = { title: 'Your document', robots: { index: false, follow: false } };

export default function SuccessPage() {
  return (
    <div className="container-x flex min-h-[70vh] max-w-xl flex-col justify-center py-12">
      <SuccessClient />
    </div>
  );
}
