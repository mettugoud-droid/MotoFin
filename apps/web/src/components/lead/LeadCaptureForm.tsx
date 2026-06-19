'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadCaptureSchema, LeadCaptureFormData } from '@/lib/validations';
import { apiPost } from '@/lib/api-client';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, Button, FormField, ErrorMessage } from '@/components/ui';
import { useState } from 'react';
import type { LeadCaptureResult } from '@/types/calculator';

export function LeadCaptureForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const sessionId = searchParams.get('sid') || '';
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LeadCaptureFormData>({
    resolver: zodResolver(leadCaptureSchema),
  });

  const onSubmit = async (data: LeadCaptureFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await apiPost<LeadCaptureResult>('/v1/calculator/capture-lead', {
        sessionId,
        calculatorType: 'savings',
        name: data.name,
        mobile: data.mobile,
        city: data.city,
        currentBank: data.currentBank || undefined,
      });
      trackEvent({ event: 'lead_submit', sessionId });
      router.push('/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card padding="lg" className="animate-slide-up">
      {error && <ErrorMessage message={error} onRetry={() => setError(null)} className="mb-6" />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField
          label="Full Name"
          type="text"
          placeholder="Enter your name"
          error={errors.name?.message}
          required
          {...register('name')}
        />

        <FormField
          label="Mobile Number"
          type="tel"
          placeholder="e.g. 9876543210"
          maxLength={10}
          error={errors.mobile?.message}
          helpText="We'll call you on this number"
          required
          {...register('mobile')}
        />

        <FormField
          label="City"
          type="text"
          placeholder="e.g. Hyderabad"
          error={errors.city?.message}
          required
          {...register('city')}
        />

        <FormField
          label="Current Bank (Optional)"
          type="text"
          placeholder="e.g. HDFC, ICICI"
          {...register('currentBank')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          className="mt-6"
        >
          Get Free Callback
        </Button>
      </form>

      <button
        onClick={() => router.back()}
        className="w-full mt-4 text-body-sm text-brand-muted hover:text-brand-secondary transition-colors py-2"
      >
        ← Back to results
      </button>
    </Card>
  );
}
