import { InputHTMLAttributes, forwardRef } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  helpText?: string;
  prefix?: string;
  suffix?: string;
  required?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, name, error, helpText, prefix, suffix, required, className = '', ...props }, ref) => {
    const inputId = name;
    const errorId = `${name}-error`;
    const helpId = `${name}-help`;

    const describedBy = error ? errorId : helpText ? helpId : undefined;

    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-body-sm font-medium text-brand-primary">
          {label}
          {required && <span className="text-feedback-error ml-0.5" aria-hidden="true">*</span>}
        </label>

        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-body-sm pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            aria-describedby={describedBy}
            aria-invalid={!!error}
            aria-required={required}
            className={`input-base ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-12' : ''} ${error ? 'input-error' : ''} ${className}`}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted text-body-sm pointer-events-none">
              {suffix}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} role="alert" aria-live="polite" className="text-caption text-feedback-error flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {helpText && !error && (
          <p id={helpId} className="text-caption text-brand-muted">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };
export type { FormFieldProps };
