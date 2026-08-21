// src/lib/cookies/consent.ts

import {
  CookieConsent,
  ConsentState,
  CONSENT_VERSION,
  CONSENT_STORAGE_KEY,
} from './types';

/**
 * Read stored consent from localStorage.
 * Returns null if nothing stored or JSON is invalid.
 */
export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // Basic shape validation
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof parsed.version !== 'string' ||
      typeof parsed.timestamp !== 'string' ||
      typeof parsed.necessary !== 'boolean' ||
      typeof parsed.preferences !== 'boolean' ||
      typeof parsed.analytics !== 'boolean' ||
      typeof parsed.marketing !== 'boolean'
    ) {
      return null;
    }

    return parsed as CookieConsent;
  } catch {
    return null;
  }
}

/**
 * Write consent to localStorage with current version and timestamp.
 */
export function setCookieConsent(
  consent: Pick<CookieConsent, 'necessary' | 'preferences' | 'analytics' | 'marketing'>
): void {
  if (typeof window === 'undefined') return;

  const full: CookieConsent = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    necessary: true, // always true
    preferences: consent.preferences,
    analytics: consent.analytics,
    marketing: consent.marketing,
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(full));
  } catch {
    // localStorage full or disabled — fail silently
  }
}

/**
 * Check the current consent state:
 * - 'undecided' — no stored consent
 * - 'valid'     — stored consent with matching version
 * - 'outdated'  — stored consent with old version
 */
export function hasCookieConsent(): ConsentState {
  const consent = getCookieConsent();

  if (!consent) return 'undecided';
  if (consent.version !== CONSENT_VERSION) return 'outdated';

  return 'valid';
}

/**
 * Remove stored consent entirely.
 */
export function clearCookieConsent(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // fail silently
  }
}
