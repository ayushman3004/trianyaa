// src/lib/cookies/types.ts

/** Current consent policy version — bump to re-trigger consent banner */
export const CONSENT_VERSION = '1.0';

/** localStorage key for persisting consent */
export const CONSENT_STORAGE_KEY = 'trianyaa_cookie_consent';

/** Cookie category identifiers */
export type CookieCategory = 'necessary' | 'preferences' | 'analytics' | 'marketing';

/** Persisted consent object */
export interface CookieConsent {
  version: string;
  timestamp: string;
  necessary: true; // always true — cannot be disabled
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

/**
 * Tri-state for consent status:
 * - 'undecided' — no stored consent (first visit)
 * - 'valid'     — stored consent with matching version
 * - 'outdated'  — stored consent with mismatched version → treat as undecided
 */
export type ConsentState = 'undecided' | 'valid' | 'outdated';

/** User-facing category metadata */
export interface CookieCategoryInfo {
  id: CookieCategory;
  title: string;
  description: string;
  locked: boolean; // true = cannot be toggled off
}

/** All four categories with display metadata */
export const COOKIE_CATEGORIES: CookieCategoryInfo[] = [
  {
    id: 'necessary',
    title: 'Necessary Cookies',
    description:
      'Essential for the website to function. These cookies enable core features like authentication, cart, checkout, and security. They cannot be disabled.',
    locked: true,
  },
  {
    id: 'preferences',
    title: 'Preference Cookies',
    description:
      'Allow the website to remember your preferences such as language, currency, theme, and other UI settings for a personalised experience.',
    locked: false,
  },
  {
    id: 'analytics',
    title: 'Analytics Cookies',
    description:
      'Help us understand how visitors interact with our website by collecting anonymous usage data. This helps us improve our products and your experience.',
    locked: false,
  },
  {
    id: 'marketing',
    title: 'Marketing Cookies',
    description:
      'Used to deliver relevant advertisements and track ad campaign performance. These cookies may be set by our advertising partners.',
    locked: false,
  },
];
