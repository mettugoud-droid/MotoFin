'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { apiPost } from '@/lib/api-client';
import { calculatorSchema, leadCaptureSchema, CalculatorFormData, LeadCaptureFormData } from '@/lib/validations';
import { SavingsResult, PreApprovalResult, LeadCaptureResult } from '@/types/calculator';

type Step = 'calculator' | 'results' | 'lead-capture' | 'success';

export default function HomePage() {
  const [step, setStep] = useState<Step>('calculator');
  const [savings, setSavings] = useState<SavingsResult | null>(null);
  const [preApproval, setPreApproval] = useState<PreApprovalResult | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calcForm = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: { currentEmi: undefined, outstandingAmount: undefined, currentRate: undefined, remainingTenure: undefined, originalTenure: undefined },
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

      // Auto-fetch pre-approval
      try {
        const sid = (response.meta as { calculationId?: string }).calculationId || '';
        const preApprovalResponse = await apiPost<PreApprovalResult>('/v1/calculator/pre-approval', { sessionId: sid });
        setPreApproval(preApprovalResponse.data);
      } catch { /* Pre-approval is optional enhancement */ }

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

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Reduce Your Car EMI</h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-2">Instant Savings Check</p>
          <p className="text-blue-200">Check how much you could save on your existing car loan in under 30 seconds.</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 -mt-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Calculator Form */}
        {step === 'calculator' && (
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">EMI Savings Calculator</h2>
            <form onSubmit={calcForm.handleSubmit(handleCalculate)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Monthly EMI (₹)</label>
                <input type="number" placeholder="e.g. 25000" {...calcForm.register('currentEmi')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {calcForm.formState.errors.currentEmi && <p className="text-red-500 text-sm mt-1">{calcForm.formState.errors.currentEmi.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outstanding Loan Amount (₹)</label>
                <input type="number" placeholder="e.g. 800000" {...calcForm.register('outstandingAmount')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {calcForm.formState.errors.outstandingAmount && <p className="text-red-500 text-sm mt-1">{calcForm.formState.errors.outstandingAmount.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Interest Rate (%)</label>
                <input type="number" step="0.01" placeholder="e.g. 12.5" {...calcForm.register('currentRate')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {calcForm.formState.errors.currentRate && <p className="text-red-500 text-sm mt-1">{calcForm.formState.errors.currentRate.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Tenure (months)</label>
                  <input type="number" placeholder="e.g. 36" {...calcForm.register('remainingTenure')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  {calcForm.formState.errors.remainingTenure && <p className="text-red-500 text-sm mt-1">{calcForm.formState.errors.remainingTenure.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Tenure (months)</label>
                  <input type="number" placeholder="e.g. 60" {...calcForm.register('originalTenure')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  {calcForm.formState.errors.originalTenure && <p className="text-red-500 text-sm mt-1">{calcForm.formState.errors.originalTenure.message}</p>}
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Calculating...' : 'Calculate Savings →'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Results + Pre-Approval */}
        {step === 'results' && savings && (
          <div className="space-y-6">
            {/* Savings Card */}
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Savings Estimate</h2>
              {savings.isRateCompetitive ? (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">{savings.competitiveMessage}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-green-600 font-medium">Monthly Saving</p>
                    <p className="text-3xl font-bold text-green-700">₹{savings.monthlySaving.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-blue-600 font-medium">Total Interest Saved</p>
                    <p className="text-3xl font-bold text-blue-700">₹{savings.totalInterestSaving.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}

              {savings.topUpEligible && savings.topUpAmount && (
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-6">
                  <p className="text-purple-800 font-medium">✓ Top-Up Eligible: ₹{savings.topUpAmount.toLocaleString('en-IN')}</p>
                </div>
              )}

              {/* Bank Comparison */}
              <h3 className="font-semibold text-gray-700 mb-3">Best Bank Offers</h3>
              <div className="space-y-3">
                {savings.bankComparisons.map((bank, i) => (
                  <div key={bank.bankName} className={`flex items-center justify-between p-3 rounded-lg ${i === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                    <div>
                      <p className="font-medium text-gray-800">{i === 0 && '🏆 '}{bank.bankName}</p>
                      <p className="text-sm text-gray-500">Rate: {bank.offeredRate}% | EMI: ₹{bank.estimatedEmi.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-bold">Save ₹{bank.monthlySaving.toLocaleString('en-IN')}/mo</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-Approval Card */}
            {preApproval && (
              <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border-2 border-green-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Pre-Approval Indication</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl ${preApproval.confidenceLevel === 'HIGH' ? 'bg-green-500' : preApproval.confidenceLevel === 'MODERATE' ? 'bg-yellow-500' : 'bg-orange-500'}`}>
                    {preApproval.approvalProbability}%
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-800">{preApproval.confidenceLevel === 'HIGH' ? '✓ High Chance of Approval' : preApproval.confidenceLevel === 'MODERATE' ? '◐ Moderate Chance' : '○ Subject to Verification'}</p>
                    <p className="text-sm text-gray-500">{preApproval.confidenceMessage}</p>
                  </div>
                </div>

                {preApproval.topUpEligibility && (
                  <p className="text-purple-700 font-medium mb-3">✓ Top-Up Eligible: ₹{preApproval.topUpEligibility.toLocaleString('en-IN')}</p>
                )}

                {preApproval.recommendedBanks.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-600 mb-2">Recommended Banks:</p>
                    <div className="flex gap-2 flex-wrap">
                      {preApproval.recommendedBanks.map((bank) => (
                        <span key={bank.bankName} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {bank.bankName} ({bank.offeredRate}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-4">{preApproval.disclaimer}</p>
              </div>
            )}

            {/* CTA Button */}
            <button onClick={() => setStep('lead-capture')} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg">
              Get Free Callback →
            </button>
          </div>
        )}

        {/* Step 3: Lead Capture Form */}
        {step === 'lead-capture' && (
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Get Your Personalized Savings Report</h2>
            <p className="text-gray-500 mb-6">A MotoFin loan specialist will contact you with the best refinance options.</p>
            <form onSubmit={leadForm.handleSubmit(handleLeadSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" placeholder="Enter your name" {...leadForm.register('name')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                {leadForm.formState.errors.name && <p className="text-red-500 text-sm mt-1">{leadForm.formState.errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input type="tel" placeholder="e.g. 9876543210" maxLength={10} {...leadForm.register('mobile')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                {leadForm.formState.errors.mobile && <p className="text-red-500 text-sm mt-1">{leadForm.formState.errors.mobile.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" placeholder="e.g. Hyderabad" {...leadForm.register('city')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                {leadForm.formState.errors.city && <p className="text-red-500 text-sm mt-1">{leadForm.formState.errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Bank (Optional)</label>
                <input type="text" placeholder="e.g. HDFC, ICICI" {...leadForm.register('currentBank')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors disabled:opacity-50">
                {isLoading ? 'Submitting...' : 'Get Free Callback →'}
              </button>
            </form>
            <button onClick={() => setStep('results')} className="w-full mt-3 text-gray-500 hover:text-gray-700 py-2 text-sm">← Back to results</button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Submitted!</h2>
            <div className="space-y-3 mb-6">
              <p className="flex items-center justify-center gap-2 text-green-600"><span>✓</span> Savings Calculated</p>
              <p className="flex items-center justify-center gap-2 text-green-600"><span>✓</span> Pre-Approval Generated</p>
              <p className="flex items-center justify-center gap-2 text-green-600"><span>✓</span> Callback Requested</p>
            </div>
            <p className="text-gray-600 mb-6">A MotoFin loan specialist will contact you shortly with personalized refinance options.</p>
            <button onClick={() => { setStep('calculator'); setSavings(null); setPreApproval(null); setError(null); calcForm.reset(); leadForm.reset(); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Calculate Again
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-8 px-4 mt-12">
        <div className="max-w-3xl mx-auto text-center text-gray-500 text-sm">
          <p className="font-medium text-gray-700 mb-2">MotoFin Technologies</p>
          <p>Vehicle finance comparison platform. We help you find the best refinance rates from 9+ partner banks.</p>
          <p className="mt-2">This is an indicative savings estimate. Final rates are subject to bank approval and document verification.</p>
        </div>
      </footer>
    </main>
  );
}
