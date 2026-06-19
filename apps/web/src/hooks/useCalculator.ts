'use client';

import { useReducer, useCallback } from 'react';
import { z } from 'zod';
import { calculatorSchema } from '@/lib/validations';
import type { SavingsResult, PreApprovalResult } from '@/types/calculator';

export interface CalculatorFormData {
  currentEmi: number | undefined;
  outstandingAmount: number | undefined;
  currentRate: number | undefined;
  remainingTenure: number | undefined;
  originalTenure: number | undefined;
}

interface CalculatorState {
  currentStep: number;
  formData: CalculatorFormData;
  isSubmitting: boolean;
  savingsResult: SavingsResult | null;
  preApprovalResult: PreApprovalResult | null;
  error: string | null;
  sessionId: string;
}

type CalculatorAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'UPDATE_FORM'; data: Partial<CalculatorFormData> }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; savings: SavingsResult; sessionId: string }
  | { type: 'PRE_APPROVAL_SUCCESS'; result: PreApprovalResult }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'RESET' };

const initialState: CalculatorState = {
  currentStep: 1,
  formData: {
    currentEmi: undefined,
    outstandingAmount: undefined,
    currentRate: undefined,
    remainingTenure: undefined,
    originalTenure: undefined,
  },
  isSubmitting: false,
  savingsResult: null,
  preApprovalResult: null,
  error: null,
  sessionId: '',
};

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step, error: null };
    case 'UPDATE_FORM':
      return { ...state, formData: { ...state.formData, ...action.data } };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, error: null };
    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false, savingsResult: action.savings, sessionId: action.sessionId };
    case 'PRE_APPROVAL_SUCCESS':
      return { ...state, preApprovalResult: action.result };
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, error: action.error };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Per-step validation schemas
const stepSchemas = {
  1: z.object({
    currentEmi: z.coerce.number().min(1, 'EMI must be at least ₹1').max(10000000, 'EMI must not exceed ₹1 Crore'),
    outstandingAmount: z.coerce.number().min(1, 'Amount must be at least ₹1').max(100000000, 'Amount must not exceed ₹10 Crore'),
  }),
  2: z.object({
    currentRate: z.coerce.number().min(1, 'Rate must be at least 1%').max(30, 'Rate must not exceed 30%'),
  }),
  3: z.object({
    remainingTenure: z.coerce.number().int().min(1, 'Tenure must be at least 1 month').max(120, 'Tenure must not exceed 120 months'),
    originalTenure: z.coerce.number().int().min(1, 'Tenure must be at least 1 month').max(120, 'Tenure must not exceed 120 months'),
  }),
} as const;

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const updateForm = useCallback((data: Partial<CalculatorFormData>) => {
    dispatch({ type: 'UPDATE_FORM', data });
  }, []);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const nextStep = useCallback(() => {
    if (state.currentStep < 4) {
      dispatch({ type: 'SET_STEP', step: state.currentStep + 1 });
    }
  }, [state.currentStep]);

  const prevStep = useCallback(() => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', step: state.currentStep - 1 });
    }
  }, [state.currentStep]);

  const validateCurrentStep = useCallback((stepData: Record<string, unknown>): { success: boolean; errors: Record<string, string> } => {
    const step = state.currentStep;
    if (step === 4 || !(step in stepSchemas)) {
      // Full validation on step 4
      const result = calculatorSchema.safeParse(state.formData);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path.join('.');
          if (!errors[path]) errors[path] = issue.message;
        });
        return { success: false, errors };
      }
      return { success: true, errors: {} };
    }

    const schema = stepSchemas[step as 1 | 2 | 3];
    const result = schema.safeParse(stepData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!errors[path]) errors[path] = issue.message;
      });
      return { success: false, errors };
    }
    return { success: true, errors: {} };
  }, [state.currentStep, state.formData]);

  const submitStart = useCallback(() => dispatch({ type: 'SUBMIT_START' }), []);
  const submitSuccess = useCallback((savings: SavingsResult, sessionId: string) => dispatch({ type: 'SUBMIT_SUCCESS', savings, sessionId }), []);
  const preApprovalSuccess = useCallback((result: PreApprovalResult) => dispatch({ type: 'PRE_APPROVAL_SUCCESS', result }), []);
  const submitError = useCallback((error: string) => dispatch({ type: 'SUBMIT_ERROR', error }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    state,
    updateForm,
    goToStep,
    nextStep,
    prevStep,
    validateCurrentStep,
    submitStart,
    submitSuccess,
    preApprovalSuccess,
    submitError,
    reset,
  };
}
