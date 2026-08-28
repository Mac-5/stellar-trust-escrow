/**
 * ReferralCard Component
 *
 * Displays the connected user's referral code and referral stats, sourced
 * from GET /api/users/me/referral (see backend/api/controllers/referralController.js
 * and backend/services/referralService.js, which generate/persist the code).
 *
 * The copy and share controls are icon-only for visual density, so each one
 * carries an explicit aria-label — otherwise a screen reader announces them
 * as unlabeled "button", giving no clue what they do.
 */

'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { Copy, Check, Share2 } from 'lucide-react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const fetcher = (url) => fetch(url, { credentials: 'include' }).then((r) => r.json());

// How long the "copied" checkmark stays visible before reverting to the copy icon.
const COPY_FEEDBACK_DURATION_MS = 2000;

export default function ReferralCard() {
  const { data, error, isLoading } = useSWR(`${API_URL}/api/users/me/referral`, fetcher);
  const { copy, isCopied } = useCopyToClipboard(COPY_FEEDBACK_DURATION_MS);
  const [shareError, setShareError] = useState(null);

  const referralCode = data?.referralCode ?? null;
  const referralLink = referralCode
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/join?ref=${referralCode}`
    : null;

  const handleCopy = useCallback(() => {
    if (referralLink) copy(referralLink);
  }, [copy, referralLink]);

  const handleShare = useCallback(async () => {
    if (!referralLink) return;
    setShareError(null);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Join me on Stellar Trust Escrow', url: referralLink });
      } else {
        await copy(referralLink);
      }
    } catch (err) {
      // AbortError fires when the user just dismisses the native share sheet.
      if (err?.name !== 'AbortError') setShareError('Unable to share referral link');
    }
  }, [copy, referralLink]);

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 animate-pulse h-24" />
    );
  }

  if (error || !referralCode) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-gray-400">
        Referral code unavailable right now.
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Your referral code</p>
          <p className="text-lg font-mono font-semibold text-white truncate">{referralCode}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            aria-label={isCopied ? 'Referral link copied' : 'Copy referral link'}
            title={isCopied ? 'Copied!' : 'Copy referral link'}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700
                       transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share referral link"
            title="Share referral link"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700
                       transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>
          <strong className="text-gray-200">{data.totalReferrals ?? 0}</strong> referrals
        </span>
        <span>
          <strong className="text-gray-200">{data.pendingRewards ?? 0}</strong> pending rewards
        </span>
      </div>

      {shareError && (
        <p role="alert" className="text-xs text-red-400">
          {shareError}
        </p>
      )}
    </div>
  );
}
