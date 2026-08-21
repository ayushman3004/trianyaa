// src/components/cookie-consent/CookieConsent.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCookieConsent } from './CookieProvider';

export default function CookieConsentBanner() {
  const { showBanner, acceptAll, acceptNecessaryOnly, openPreferences } =
    useCookieConsent();

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          className="cookie-banner"
          role="dialog"
          aria-label="Cookie consent"
          aria-describedby="cookie-banner-description"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        >
          <div className="cookie-banner-inner">
            {/* Icon + text */}
            <div className="cookie-banner-content">
              <div className="cookie-banner-icon" aria-hidden="true">
                🍪
              </div>
              <div className="cookie-banner-text">
                <h3 className="cookie-banner-heading serif">
                  We value your privacy
                </h3>
                <p id="cookie-banner-description" className="cookie-banner-desc">
                  We use cookies to enhance your browsing experience, serve
                  personalised content, and analyse our traffic. You can choose
                  which cookies you&apos;d like to allow.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="cookie-banner-actions">
              <button
                type="button"
                className="cookie-btn cookie-btn-outline"
                onClick={acceptNecessaryOnly}
                id="cookie-btn-necessary"
              >
                Necessary Only
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-outline"
                onClick={openPreferences}
                id="cookie-btn-customize"
              >
                Customize
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-filled"
                onClick={acceptAll}
                id="cookie-btn-accept-all"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
