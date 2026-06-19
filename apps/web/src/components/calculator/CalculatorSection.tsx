'use client';

import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculatorSchema, CalculatorFormData } from '@/lib/validations';
import { apiPost } from '@/lib/api-client';
import { useCalculator } from '@/hooks/useCalculator';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card } from '@/components/ui';
import { ProgressIndicator } from './ProgressIndicator';
import { StepOne } from './StepOne';
import { StepTwo } from './StepTwo';
import { StepThree } from './StepThree';
import { StepFour } from './StepFour';
import { CalculatorNavigation } from './CalculatorNavigation';
import { ErrorMessage } from '@/components/ui';
import { CALCULATOR_STEPS } from '@/lib/constants';
import type { SavingsResult, PreApprovalResult } from '@/types/calculator';

export function CalculatorSection() {
  const { state, updateForm, goToStep, nextStep, prevStep, submitStart, submitSuccess, preApprovalSuccess, submitError } = useCalculator();
  const { trackEvent } = useAnalytics();
  const hasTrackedStart = useRef(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      currentEmi: undefined,
      outstandingAmount: undefined,
      currentRate: undefined,
      remainingTenure: undefined,
      originalTenure: undefined,
    },
    mode: 'onBlur',
  });

  // Track calculator start on first field interaction
  const handleFirstInteraction = () => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackEvent({ event: 'calculator_start' });
    }
  };

  // Focus first input on step change
  useEffect(() => {
    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [state.currentStep]);

  const handleNext = async () => {
    let fieldsToValidate: (keyof CalculatorFormData)[] = [];

    switch (state.currentStep) {
      case 1: fieldsToValidate = ['currentEmi', 'outstandingAmount']; break;
      case 2: fieldsToValidate = ['currentRate']; break;
      case 3: fieldsToValidate = ['remainingTenure', 'originalTenure']; break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      const values = form.getValues();
      updateForm(values);
      trackEvent({ event: 'calculator_step_complete', step: state.currentStep });
      nextStep();
    }
  };

  const handleBack = () => {
    const values = form.getValues();
    updateForm(values);
    prevStep();
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const data = form.getValues();
    submitStart();

    try {
      const response = await apiPost<SavingsResult>('/v1/calculator/savings', data);
      const sid = (response.meta as { calculationId?: string }).calculationId || '';
      submitSuccess(response.data, sid);
      trackEvent({ event: 'calculator_complete', sessionId: sid });

      // Auto-fetch pre-approval
      try {
        const preApprovalResponse = await apiPost<PreApprovalResult>('/v1/calculator/pre-approval', { sessionId: sid });
        preApprovalSuccess(preApprovalResponse.data);
      } catch {
        // Pre-approval is optional enhancement
      }
    } catch (err) {
      submitError(err instanceof Error ? err.message : 'Calculation failed. Please try again.');
    }
  };

  return (
    <section id="calculator-section" aria-labelledby="calculator-heading" className="section">
      <div className="container-app max-w-2xl">
        <Card padding="lg" className="animate-slide-up">
          <h2 id="calculator-heading" className="text-h2 text-brand-primary text-center mb-2">
            EMI Savings Calculator
          </h2>
          <p className="text-body-sm text-brand-secondary text-center mb-8">
            Fill in your loan details to discover potential savings
          </p>

          <ProgressIndicator currentStep={state.currentStep} totalSteps={CALCULATOR_STEPS.length} />

          {state.error && (
            <ErrorMessage message={state.error} onRetry={() => submitError('')} className="mb-6" />
          )}

          <div onFocus={handleFirstInteraction}>
            {state.currentStep === 1 && <StepOne register={form.register} errors={form.formState.errors} />}
            {state.currentStep === 2 && <StepTwo register={form.register} errors={form.formState.errors} />}
            {state.currentStep === 3 && <StepThree register={form.register} errors={form.formState.errors} />}
            {state.currentStep === 4 && <StepFour formData={form.getValues()} onEdit={goToStep} />}
          </div>

          <CalculatorNavigation
            currentStep={state.currentStep}
            totalSteps={CALCULATOR_STEPS.length}
            isSubmitting={state.isSubmitting}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </section>
  );
}
