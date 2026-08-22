import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Element rendered inside the right side of the field (e.g. password toggle). */
  trailing?: ReactNode;
  trailingAction?: () => void;
}

export function AuthInput({ label, error, trailing, trailingAction, className = '', id: idProp, ...props }: AuthInputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <div className="auth-field">
      <input
        id={id}
        placeholder=" "
        {...props}
        className={`auth-input ${error ? 'auth-input-error' : ''} ${trailing ? 'auth-input-trailing' : ''} ${className}`}
      />
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      {trailing && (
        <button
          type="button"
          onClick={trailingAction}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer z-10"
        >
          {trailing}
        </button>
      )}
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}

interface AuthSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export function AuthSelect({ label, error, className = '', id: idProp, children, ...props }: AuthSelectProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-label auth-label-top">
        {label}
      </label>
      <select
        id={id}
        {...props}
        className={`auth-input cursor-pointer ${error ? 'auth-input-error' : ''} ${className}`}
      >
        {children}
      </select>
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}
