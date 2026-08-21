// src/components/cookie-consent/CookieProvider.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { CookieConsent, ConsentState } from '@/lib/cookies/types';
import {
  getCookieConsent,
  setCookieConsent,
  clearCookieConsent,
  hasCookieConsent,
} from '@/lib/cookies/consent';

interface CookieConsentContextValue {
  /** Current consent object, or null if undecided / not yet hydrated */
  consent: CookieConsent | null;
  /** Tri-state consent status */
  consentState: ConsentState;
  /** Whether the banner should be visible */
  showBanner: boolean;
  /** Whether the preferences modal is open */
  showPreferences: boolean;
  /** Accept all cookie categories */
  acceptAll: () => void;
  /** Accept only necessary cookies */
  acceptNecessaryOnly: () => void;
  /** Save custom preferences */
  savePreferences: (prefs: {
    preferences: boolean;
    analytics: boolean;
    marketing: boolean;
  }) => void;
  /** Open the preferences modal */
  openPreferences: () => void;
  /** Close the preferences modal */
  closePreferences: () => void;
  /** Reset consent (clear storage, show banner again) */
  resetConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [consentState, setConsentState] = useState<ConsentState>('undecided');
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const state = hasCookieConsent();
    setConsentState(state);

    if (state === 'valid') {
      setConsent(getCookieConsent());
      setShowBanner(false);
    } else {
      // 'undecided' or 'outdated' → show banner
      setConsent(null);
      setShowBanner(true);
    }

    setHydrated(true);
  }, []);

  const acceptAll = useCallback(() => {
    const prefs = {
      necessary: true as const,
      preferences: true,
      analytics: true,
      marketing: true,
    };
    setCookieConsent(prefs);
    setConsent(getCookieConsent());
    setConsentState('valid');
    setShowBanner(false);
    setShowPreferences(false);
  }, []);

  const acceptNecessaryOnly = useCallback(() => {
    const prefs = {
      necessary: true as const,
      preferences: false,
      analytics: false,
      marketing: false,
    };
    setCookieConsent(prefs);
    setConsent(getCookieConsent());
    setConsentState('valid');
    setShowBanner(false);
    setShowPreferences(false);
  }, []);

  const savePreferences = useCallback(
    (prefs: { preferences: boolean; analytics: boolean; marketing: boolean }) => {
      setCookieConsent({
        necessary: true,
        preferences: prefs.preferences,
        analytics: prefs.analytics,
        marketing: prefs.marketing,
      });
      setConsent(getCookieConsent());
      setConsentState('valid');
      setShowBanner(false);
      setShowPreferences(false);
    },
    []
  );

  const openPreferences = useCallback(() => {
    setShowPreferences(true);
  }, []);

  const closePreferences = useCallback(() => {
    setShowPreferences(false);
  }, []);

  const resetConsent = useCallback(() => {
    clearCookieConsent();
    setConsent(null);
    setConsentState('undecided');
    setShowBanner(true);
    setShowPreferences(false);
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consent,
      consentState,
      showBanner: hydrated && showBanner,
      showPreferences,
      acceptAll,
      acceptNecessaryOnly,
      savePreferences,
      openPreferences,
      closePreferences,
      resetConsent,
    }),
    [
      consent,
      consentState,
      hydrated,
      showBanner,
      showPreferences,
      acceptAll,
      acceptNecessaryOnly,
      savePreferences,
      openPreferences,
      closePreferences,
      resetConsent,
    ]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

/**
 * Access the cookie consent context from any client component.
 * Must be used within a <CookieConsentProvider>.
 */
export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error('useCookieConsent must be used inside <CookieConsentProvider>');
  }
  return ctx;
}
