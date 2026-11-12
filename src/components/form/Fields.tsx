'use client';

import { useId, type ReactNode } from 'react';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

type Base = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

function Wrap({ name, error, hint, className, children }: Base & { children: ReactNode }) {
  return (
    <div data-field={name} data-error={error ? 'true' : undefined} className={className}>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[13px] leading-snug text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

function Label({ htmlFor, label, required }: { htmlFor: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="label">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

export function TextField(
  props: Base & {
    value: string;
    onChange: (v: string) => void;
    type?: 'text' | 'date' | 'email' | 'tel';
    placeholder?: string;
    inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email';
    autoComplete?: string;
    maxLength?: number;
    prefix?: string;
    uppercase?: boolean;
  },
) {
  const id = useId();
  return (
    <Wrap {...props}>
      <Label htmlFor={id} label={props.label} required={props.required} />
      <div className="relative">
        {props.prefix && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
            {props.prefix}
          </span>
        )}
        <input
          id={id}
          name={props.name}
          type={props.type ?? 'text'}
          value={props.value}
          onChange={(e) => props.onChange(props.uppercase ? e.target.value.toUpperCase() : e.target.value)}
          placeholder={props.placeholder}
          inputMode={props.inputMode}
          autoComplete={props.autoComplete ?? 'off'}
          maxLength={props.maxLength}
          aria-invalid={!!props.error}
          className={cx('input', props.prefix && 'pl-7', props.error && 'input-error', props.type === 'date' && 'appearance-none')}
        />
      </div>
    </Wrap>
  );
}

export function TextArea(
  props: Base & { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; maxLength?: number },
) {
  const id = useId();
  return (
    <Wrap {...props}>
      <Label htmlFor={id} label={props.label} required={props.required} />
      <textarea
        id={id}
        name={props.name}
        value={props.value}
        rows={props.rows ?? 3}
        maxLength={props.maxLength}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        aria-invalid={!!props.error}
        className={cx('input h-auto min-h-[96px] py-3 leading-relaxed', props.error && 'input-error')}
      />
    </Wrap>
  );
}

export function SelectField(
  props: Base & { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] },
) {
  const id = useId();
  return (
    <Wrap {...props}>
      <Label htmlFor={id} label={props.label} required={props.required} />
      <div className="relative">
        <select
          id={id}
          name={props.name}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          aria-invalid={!!props.error}
          className={cx('input appearance-none pr-10', props.error && 'input-error')}
        >
          {props.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
        </svg>
      </div>
    </Wrap>
  );
}

export function Segmented<T extends string>(
  props: Base & { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] },
) {
  return (
    <Wrap {...props}>
      <span className="label">{props.label}</span>
      <div role="radiogroup" aria-label={props.label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-slate-100 p-1">
        {props.options.map((o) => {
          const active = o.value === props.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => props.onChange(o.value)}
              className={cx(
                'min-h-[44px] rounded-lg px-3 text-sm font-medium transition',
                active ? 'bg-white text-navy-950 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-navy-900',
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </Wrap>
  );
}

export function Toggle(props: Base & { checked: boolean; onChange: (v: boolean) => void; description?: string }) {
  const id = useId();
  return (
    <Wrap {...props}>
      <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <label htmlFor={id} className="cursor-pointer">
          <span className="block text-[15px] font-medium text-slate-900">{props.label}</span>
          {props.description && <span className="mt-0.5 block text-[13px] leading-snug text-slate-500">{props.description}</span>}
        </label>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={props.checked}
          onClick={() => props.onChange(!props.checked)}
          className={cx(
            'relative mt-0.5 inline-flex h-7 w-12 shrink-0 items-center rounded-full transition',
            props.checked ? 'bg-navy-900' : 'bg-slate-300',
          )}
        >
          <span
            className={cx(
              'inline-block h-6 w-6 rounded-full bg-white shadow transition-transform',
              props.checked ? 'translate-x-[22px]' : 'translate-x-0.5',
            )}
          />
        </button>
      </div>
    </Wrap>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-navy-950">{title}</h2>
      {description && <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export const full = 'sm:col-span-2';

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
  'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

export const STATE_OPTIONS = [{ value: '', label: 'Select a state' }, ...US_STATES.map((s) => ({ value: s, label: s }))];
