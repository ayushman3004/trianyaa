// src/components/cookie-consent/CookiePreferences.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCookieConsent } from './CookieProvider';
import { COOKIE_CATEGORIES } from '@/lib/cookies/types';
import type { CookieCategory } from '@/lib/cookies/types';

export default function CookiePreferences() {
  const {
    consent,
    showPreferences,
    closePreferences,
    savePreferences,
    acceptAll,
  } = useCookieConsent();

  // Local toggle state for the preferences form
  const [toggles, setToggles] = useState<Record<CookieCategory, boolean>>({
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false,
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Sync toggles with existing consent when modal opens
  useEffect(() => {
    if (showPreferences) {
      setToggles({
        necessary: true,
        preferences: consent?.preferences ?? false,
        analytics: consent?.analytics ?? false,
        marketing: consent?.marketing ?? false,
      });
    }
  }, [showPreferences, consent]);

  // Focus the close button when modal opens
  useEffect(() => {
    if (showPreferences) {
      // Small delay to let animation start
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showPreferences]);

  // ESC to close
  useEffect(() => {
    if (!showPreferences) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePreferences();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showPreferences, closePreferences]);

  // Trap focus within the modal
  useEffect(() => {
    if (!showPreferences || !panelRef.current) return;

    const panel = panelRef.current;
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = panel.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [showPreferences]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showPreferences) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPreferences]);

  const handleToggle = useCallback((category: CookieCategory) => {
    setToggles((prev) => ({ ...prev, [category]: !prev[category] }));
  }, []);

  const handleSave = useCallback(() => {
    savePreferences({
      preferences: toggles.preferences,
      analytics: toggles.analytics,
      marketing: toggles.marketing,
    });
  }, [savePreferences, toggles]);

  return (
    <AnimatePresence>
      {showPreferences && (
        <motion.div
          className="cookie-prefs-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closePreferences}
          aria-hidden="true"
        >
          <motion.div
            className="cookie-prefs-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Cookie preferences"
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="cookie-prefs-header">
              <div className="cookie-prefs-title-group">
                <span className="cookie-prefs-icon" aria-hidden="true">
                  🍪
                </span>
                <h2 className="cookie-prefs-title serif">Cookie Preferences</h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="cookie-prefs-close"
                onClick={closePreferences}
                aria-label="Close cookie preferences"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Description */}
            <p className="cookie-prefs-desc">
              Choose which cookies you&apos;d like to allow. Your preferences
              will be saved and you can change them anytime from the footer.
            </p>

            {/* Categories */}
            <div className="cookie-prefs-categories">
              {COOKIE_CATEGORIES.map((cat) => (
                <div className="cookie-category-card" key={cat.id}>
                  <div className="cookie-category-info">
                    <div className="cookie-category-header">
                      <h3 className="cookie-category-title">{cat.title}</h3>
                      {cat.locked && (
                        <span className="cookie-category-badge">
                          Always Active
                        </span>
                      )}
                    </div>
                    <p className="cookie-category-desc">{cat.description}</p>
                  </div>

                  <div className="cookie-toggle-wrapper">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={toggles[cat.id]}
                      aria-label={`${cat.locked ? 'Always active' : toggles[cat.id] ? 'Disable' : 'Enable'} ${cat.title}`}
                      className={`cookie-toggle ${toggles[cat.id] ? 'cookie-toggle-on' : ''} ${cat.locked ? 'cookie-toggle-locked' : ''}`}
                      disabled={cat.locked}
                      onClick={() => handleToggle(cat.id)}
                      id={`cookie-toggle-${cat.id}`}
                    >
                      <span className="cookie-toggle-thumb" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="cookie-prefs-actions">
              <button
                type="button"
                className="cookie-btn cookie-btn-filled"
                onClick={handleSave}
                id="cookie-btn-save"
              >
                Save Preferences
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-outline"
                onClick={acceptAll}
                id="cookie-btn-accept-all-prefs"
              >
                Accept All
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
