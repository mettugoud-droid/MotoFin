/**
 * Shared constants used across the platform.
 */

/** Default tenant ID for MVP (single-tenant mode) */
export const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

/** API version prefix */
export const API_PREFIX = 'api/v1';

/** Rate limiting thresholds */
export const RATE_LIMITS = {
  CALCULATOR_PUBLIC: 5000, // requests per minute
  AUTHENTICATED_USER: 100, // requests per minute
} as const;

/** Calculator input validation ranges */
export const CALCULATOR_LIMITS = {
  EMI_MIN: 1,
  EMI_MAX: 10_000_000,
  OUTSTANDING_MIN: 1,
  OUTSTANDING_MAX: 100_000_000,
  RATE_MIN: 0.01,
  RATE_MAX: 50.0,
  TENURE_MIN: 1,
  TENURE_MAX: 360,
} as const;

/** Supported bank partners */
export const BANK_PARTNERS = [
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'IndusInd Bank',
  'AU Small Finance Bank',
  'Shriram Finance',
  'Cholamandalam Finance',
  'Mahindra Finance',
] as const;

/** Lead source types */
export const LEAD_SOURCES = [
  'meta_lead_ads',
  'google_lead_forms',
  'landing_page',
  'whatsapp_campaign',
  'referral_partner',
  'dealer_network',
  'savings_calculator',
  'foreclosure_calculator',
  'google_ads',
  'website',
] as const;
