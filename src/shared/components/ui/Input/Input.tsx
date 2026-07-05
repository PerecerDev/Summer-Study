import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className = '', ...props },
  ref,
) {
  const inputId = id ?? props.name ?? 'input';

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-lg font-semibold text-text-primary">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={[
          'min-h-touch-lg w-full rounded-xl border bg-surface px-4 text-lg text-text-primary outline-none transition-colors',
          error ? 'border-correction' : 'border-black/10 focus:border-primary',
          className,
        ].join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-base text-correction" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
