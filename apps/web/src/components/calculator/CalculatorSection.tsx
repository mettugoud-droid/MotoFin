'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ArrowLeft, Lock, Building2, CheckCircle } from 'lucide-react';

import { apiPost } from '@/lib/api-client';
import { calculatorSchema, leadCaptureSchema, CalculatorFormData, LeadCaptureFormData } from '@/lib/validations';
import { SavingsResult, PreApprovalResult, LeadCaptureResult } from '@/types/calculator';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { ApprovalGauge } from '@/components/ui/ApprovalGauge';
import { ResultsSkeleton } from '@/components/ui/Skeleton';

type Step = 'calculator' | 'results' | 'lead-capture' | 'success';

const stepLabels = ['Loan Details', 'Savings Result', 'Get Callback', 'Confirmed'];

function getStepNumber(step: Step) {
  const map = { calculator: 1, results: 2, 'lead-capture': 3, success: 4 };
  return map[step];
}

export function CalculatorSection() {
  const [step, setStep] = useState<Step>('calculator');
  const [savings, setSavings] = useState<SavingsResult | null>(null);
  const [preApproval, setPreApproval] = useState<PreApprovalResult | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calcForm = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      currentEmi: undefined,
      outstandingAmount: undefined,
      currentRate: undefined,
      remainingTenure: undefined,
      originalTenure: undefined,
    },
  });

  const leadForm = useForm<LeadCaptureFormData>({
    resolver: zodResolver(leadCaptureSchema),
  });

  const handleCalculate = async (data: CalculatorFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiPost<SavingsResult>('/v1/calculator/savings', data);
      setSavings(response.data);
      setSessionId((response.meta as { calculationId?: string }).calculationId || '');

      try {
        const sid = (response.meta as { calculationId?: string }).calculationId || '';
        const preApprovalResponse = await apiPost<PreApprovalResult>('/v1/calculator/pre-approval', { sessionId: sid });
        setPreApproval(preApprovalResponse.data);
      } catch { /* Pre-approval is optional */ }

      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = async (data: LeadCaptureFormData) => {
    setIsLoading(true);
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
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setStep('calculator');
    setSavings(null);
    setPreApproval(null);
    setError(null);
    calcForm.reset();
    leadForm.reset();
  };

  return (
    <section id="calculator" className="relative -mt-16 md:-mt-20 px-4 pb-12">
      <div className="max-w-xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-card-xl border border-slate-100 overflow-hidden">
          {/* Progress Bar */}
          <div className="px-6 pt-6">
            <ProgressBar
              currentStep={getStepNumber(step)}
              totalSteps={4}
              labels={stepLabels}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mt-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Calculator */}
          {step === 'calculator' && (
            <div className="p-6 animate-fade-in-up">
              <h2 className="text-xl font-bold text-slate-800 mb-6">EMI Savings Calculator</h2>
              <form onSubmit={calcForm.handleSubmit(handleCalculate)} className="space-y-5">
                <FormField
                  label="Current Monthly EMI"
                  prefix="₹"
                  placeholder="25,000"
                  type="number"
                  error={calcForm.formState.errors.currentEmi?.message}
                  {...calcForm.register('currentEmi')}
                />
                <FormField
                  label="Outstanding Loan Amount"
                  prefix="₹"
                  placeholder="8,00,000"
                  type="number"
                  error={calcForm.formState.errors.outstandingAmount?.message}
                  {...calcForm.register('outstandingAmount')}
                />
                <FormField
                  label="Current Interest Rate"
                  suffix="%"
                  placeholder="12.5"
                  type="number"
                  step="0.01"
                  error={calcForm.formState.errors.currentRate?.message}
                  {...calcForm.register('currentRate')}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Remaining (months)"
                    placeholder="36"
                    type="number"
                    error={calcForm.formState.errors.remainingTenure?.message}
                    {...calcForm.register('remainingTenure')}
                  />
                  <FormField
                    label="Original (months)"
                    placeholder="60"
                    type="number"
                    error={calcForm.formState.errors.originalTenure?.message}
                    {...calcForm.register('originalTenure')}
                  />
                </div>
                <Button type="submit" loading={isLoading} fullWidth size="lg">
                  Check My Savings <ArrowRight size={18} />
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <Lock size={12} /> Your data is encrypted and never shared
                </p>
              </form>
            </div>
          )}

          {/* Loading */}
          {step === 'results' && isLoading && <ResultsSkeleton />}

          {/* Step 2: Results — Conversion-Focused Redesign */}
          {step === 'results' && !isLoading && savings && (
            <div className="animate-fade-in-up">
              {savings.isRateCompetitive ? (
                <div className="p-6">
                  <div className="bg-green-50 border border-green-200 p-5 rounded-xl mb-6">
                    <p className="text-green-800 font-medium">{savings.competitiveMessage}</p>
                  </div>
                  <Button fullWidth onClick={() => setStep('lead-capture')}>
                    Check Top-Up Eligibility <ArrowRight size={18} />
                  </Button>
                </div>
              ) : (
                <>
                  {/* Hero-style Savings Display */}
                  <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-6 md:p-8 text-center">
                    <p className="text-green-100 text-sm font-medium mb-1">🎉 You Could Save</p>
                    <div className="my-2">
                      <AnimatedCounter
                        value={savings.monthlySaving}
                        className="text-4xl md:text-5xl text-white"
                      />
                    </div>
                    <p className="text-green-100 font-semibold tracking-wide uppercase text-sm">
                      Every Month
                    </p>
                  </div>

                  {/* Secondary Metrics */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
                        <p className="text-[11px] font-medium text-blue-500 uppercase tracking-wide mb-1">
                          Potential Lifetime Saving
                        </p>
                        <AnimatedCounter value={savings.totalInterestSaving} className="text-xl text-blue-700" />
                      </div>
                      {savings.topUpEligible && savings.topUpAmount ? (
                        <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl text-center">
                          <p className="text-[11px] font-medium text-purple-500 uppercase tracking-wide mb-1">
                            Top-Up Eligibility
                          </p>
                          <AnimatedCounter value={savings.topUpAmount} className="text-xl text-purple-700" />
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">
                            Yearly Saving
                          </p>
                          <AnimatedCounter value={savings.monthlySaving * 12} className="text-xl text-slate-700" />
                        </div>
                      )}
                    </div>

                    {/* Bank Comparison */}
                    <h3 className="font-semibold text-slate-700 mb-3 text-sm">Best Bank Offers</h3>
                    <div className="space-y-2.5 mb-6">
                      {savings.bankComparisons.map((bank, i) => (
                        <div
                          key={bank.bankName}
                          className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 ${
                            i === 0
                              ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 shadow-sm'
                              : 'bg-slate-50 border border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                              <Building2 size={16} className="text-slate-500" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 text-sm">
                                {i === 0 && <span className="text-amber-600 mr-1">★</span>}
                                {bank.bankName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {bank.offeredRate}% · EMI ₹{bank.estimatedEmi.toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-green-600 font-bold text-sm tabular-nums">
                              ₹{bank.monthlySaving.toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-slate-400">saved/mo</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pre-Approval — Enhanced Gauge (Task 3) */}
                    {preApproval && (
                      <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-5 mb-6">
                        <h3 className="font-semibold text-slate-800 mb-4 text-center text-sm">
                          Approval Probability
                        </h3>
                        <div className="flex flex-col items-center">
                          <ApprovalGauge
                            probability={preApproval.approvalProbability}
                            confidenceLevel={preApproval.confidenceLevel}
                            size={140}
                          />
                          <p className="text-sm text-slate-600 mt-4 text-center font-medium max-w-xs">
                            {preApproval.confidenceMessage}
                          </p>
                          {preApproval.recommendedBanks.length > 0 && (
                            <div className="flex gap-2 flex-wrap justify-center mt-3">
                              {preApproval.recommendedBanks.map((bank) => (
                                <span key={bank.bankName} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-100">
                                  {bank.bankName} ({bank.offeredRate}%)
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-[10px] text-slate-400 mt-4 text-center">{preApproval.disclaimer}</p>
                        </div>
                      </div>
                    )}

                    <Button fullWidth onClick={() => setStep('lead-capture')}>
                      Get Free Callback <ArrowRight size={18} />
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Lead Capture */}
          {step === 'lead-capture' && (
            <div className="p-6 animate-fade-in-up">
              <button
                onClick={() => setStep('results')}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Get Your Free Savings Report</h2>
              <p className="text-sm text-slate-500 mb-4">
                A specialist will call within 30 minutes.
              </p>

              {savings && !savings.isRateCompetitive && (
                <div className="bg-green-50 border border-green-100 p-3 rounded-lg mb-4 text-center">
                  <p className="text-green-700 text-sm font-medium">
                    💰 You could save ₹{savings.monthlySaving.toLocaleString('en-IN')}/month
                  </p>
                </div>
              )}

              {/* Callback Trust Section (Task 4) */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-5">
                <div className="grid grid-cols-1 gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Free Eligibility Check</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">No Impact on Credit Score</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Multiple Bank Comparison</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Loan Specialist Calls Within 30 Minutes</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">No Obligation</span>
                  </div>
                </div>
              </div>

              <form onSubmit={leadForm.handleSubmit(handleLeadSubmit)} className="space-y-4">
                <FormField
                  label="Full Name"
                  placeholder="Enter your name"
                  type="text"
                  autoComplete="name"
                  error={leadForm.formState.errors.name?.message}
                  {...leadForm.register('name')}
                />
                <FormField
                  label="Mobile Number"
                  prefix="+91"
                  placeholder="9876543210"
                  type="tel"
                  inputMode="tel"
                  maxLength={10}
                  error={leadForm.formState.errors.mobile?.message}
                  {...leadForm.register('mobile')}
                />
                <FormField
                  label="City"
                  placeholder="e.g. Hyderabad"
                  type="text"
                  error={leadForm.formState.errors.city?.message}
                  {...leadForm.register('city')}
                />
                <FormField
                  label="Current Bank (Optional)"
                  placeholder="e.g. HDFC, ICICI"
                  type="text"
                  {...leadForm.register('currentBank')}
                />
                <Button type="submit" loading={isLoading} fullWidth>
                  Get Free Callback <ArrowRight size={18} />
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <Lock size={12} /> We&apos;ll never spam or share your number
                </p>
              </form>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="p-6 text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Your Request Has Been Received
              </h2>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 mb-6 text-left">
                <p className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle size={16} /> Savings Calculated
                </p>
                <p className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle size={16} /> Pre-Approval Generated
                </p>
                <p className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle size={16} /> Callback Scheduled
                </p>
              </div>
              <p className="text-slate-600 text-sm mb-6">
                Expected callback: <strong>Within 30 Minutes</strong>
              </p>
              <Button variant="outline" onClick={resetAll}>
                Calculate Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Form Field ──────────────────────────────────────────── */

import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  prefix?: string;
  suffix?: string;
  error?: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, prefix, suffix, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full h-12 px-4 ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-10' : ''} bg-white border ${
              error ? 'border-red-300 focus:ring-red-500/15 focus:border-red-400' : 'border-slate-200 focus:ring-blue-500/15 focus:border-blue-400'
            } rounded-lg text-slate-800 placeholder:text-slate-400 transition-all duration-150 hover:border-slate-300 focus:outline-none focus:ring-2 ${className || ''}`}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
FormField.displayName = 'FormField';
