'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { z } from 'zod';
import type { DocType } from '@/lib/products';
import { issuesToErrors } from '@/lib/schemas';

/**
 * Form state for a generator. Drafts are kept in sessionStorage (cleared when the tab closes)
 * so users don't lose work after returning from a cancelled checkout. Sensitive keys
 * (e.g. the TIN) are never written to storage.
 */
export function useDocForm<T extends Record<string, unknown>>(
  docType: DocType,
  defaults: T,
  schema: z.ZodTypeAny,
  sensitive: (keyof T)[] = [],
) {
  const [data, setData] = useState<T>(defaults);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const hydrated = useRef(false);
  const sensitiveRef = useRef(sensitive);
  const storageKey = `usfk:draft:${docType}`;

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) setData((d) => ({ ...d, ...JSON.parse(raw) }));
    } catch {
      /* storage unavailable */
    }
    hydrated.current = true;
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      const copy: Record<string, unknown> = { ...data };
      for (const k of sensitiveRef.current) delete copy[k as string];
      sessionStorage.setItem(storageKey, JSON.stringify(copy));
    } catch {
      /* storage unavailable */
    }
  }, [data, storageKey]);

  const validate = useCallback(() => {
    setSubmitted(true);
    const r = schema.safeParse(data);
    const next = r.success ? {} : issuesToErrors(r.error);
    setErrors(next);
    return r.success;
  }, [data, schema]);

  // After the first submit attempt, re-validate live so errors clear as the user fixes them.
  useEffect(() => {
    if (!submitted) return;
    const r = schema.safeParse(data);
    setErrors(r.success ? {} : issuesToErrors(r.error));
  }, [data, submitted, schema]);

  const set = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setData((d) => ({ ...d, [key]: value }));
  }, []);

  /** Bind a string field: <TextField {...text('sellerName')} label="…" /> */
  const text = (key: keyof T & string) => ({
    name: key,
    value: String(data[key] ?? ''),
    onChange: (v: string) => set(key, v as T[typeof key]),
    error: errors[key],
  });

  const toggle = (key: keyof T & string) => ({
    name: key,
    checked: Boolean(data[key]),
    onChange: (v: boolean) => set(key, v as T[typeof key]),
    error: errors[key],
  });

  return { data, set, text, toggle, errors, setErrors, validate };
}
