'use client';

import { useCallback, useState } from 'react';
import useSWR from 'swr';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const fetcher = (url) => fetch(url, { credentials: 'include' }).then((r) => r.json());

// Poll interval for refreshing vote state from the dispute API.
export const DISPUTE_VOTES_REFRESH_INTERVAL_MS = 15_000;
// Maximum number of vote records returned per request.
export const DISPUTE_VOTES_PAGE_LIMIT = 25;

// Accessible names for icon-only vote/flag controls, keyed by action. Used by
// consumers rendering icon buttons so every one carries a meaningful
// aria-label instead of icon-only markup with no text alternative.
export const VOTE_ACTION_LABELS = {
  upvote: 'Vote to uphold this dispute outcome',
  downvote: 'Vote to overturn this dispute outcome',
  flag: 'Flag this vote for arbiter review',
};

export function getVoteAriaLabel(action, count) {
  const base = VOTE_ACTION_LABELS[action] || 'Vote on this dispute';
  return typeof count === 'number' ? `${base} (${count} so far)` : base;
}

/**
 * Fetch and cast votes on a dispute's proposed resolution.
 *
 * @param {number|string} disputeId
 * @returns {{
 *   votes: Array,
 *   isLoading: boolean,
 *   error: Error|null,
 *   castVote: (action: 'upvote'|'downvote'|'flag') => Promise<void>,
 *   isSubmitting: boolean,
 *   refreshInterval: number,
 *   limit: number,
 * }}
 */
export function useDisputeVotes(disputeId) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { data, error, isLoading, mutate } = useSWR(
    disputeId
      ? `${API_URL}/api/disputes/${disputeId}/votes?limit=${DISPUTE_VOTES_PAGE_LIMIT}`
      : null,
    fetcher,
    { refreshInterval: DISPUTE_VOTES_REFRESH_INTERVAL_MS, refreshWhenHidden: false },
  );

  const castVote = useCallback(
    async (action) => {
      if (!disputeId || !VOTE_ACTION_LABELS[action]) return;

      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetch(`${API_URL}/api/disputes/${disputeId}/votes`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });
        if (!res.ok) throw new Error(`Failed to cast vote: ${res.status}`);
        await mutate();
      } catch (err) {
        setSubmitError(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [disputeId, mutate],
  );

  return {
    votes: data?.votes ?? [],
    isLoading,
    error: error ?? submitError,
    castVote,
    isSubmitting,
    refreshInterval: DISPUTE_VOTES_REFRESH_INTERVAL_MS,
    limit: DISPUTE_VOTES_PAGE_LIMIT,
  };
}
