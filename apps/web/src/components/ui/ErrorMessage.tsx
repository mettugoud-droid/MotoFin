interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className = '' }: ErrorMessageProps) {
  return (
    <div className={`bg-feedback-errorLight border border-feedback-error/20 rounded-xl p-4 ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-feedback-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <p className="text-body-sm text-feedback-error font-medium">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-body-sm text-feedback-error underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-feedback-error/50 rounded"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
