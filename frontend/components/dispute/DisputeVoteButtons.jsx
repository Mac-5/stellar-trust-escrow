'use client';

import { ThumbsUp, ThumbsDown, Flag, Loader2 } from 'lucide-react';
import { useDisputeVotes, VOTE_ACTION_LABELS, getVoteAriaLabel } from '../../hooks/useDisputeVotes';

/**
 * Icon-only vote controls for a dispute's proposed resolution.
 *
 * Every button here renders only an icon — no visible text — so each one
 * must carry an explicit aria-label describing what it does, otherwise
 * screen reader users only hear "button".
 */
export default function DisputeVoteButtons({ disputeId }) {
  const { votes, isSubmitting, castVote } = useDisputeVotes(disputeId);

  const upvoteCount = votes.filter((v) => v.action === 'upvote').length;
  const downvoteCount = votes.filter((v) => v.action === 'downvote').length;

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Dispute vote actions">
      <button
        type="button"
        onClick={() => castVote('upvote')}
        disabled={isSubmitting}
        aria-label={getVoteAriaLabel('upvote', upvoteCount)}
        title={VOTE_ACTION_LABELS.upvote}
        className="p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
      >
        <ThumbsUp className="w-4 h-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => castVote('downvote')}
        disabled={isSubmitting}
        aria-label={getVoteAriaLabel('downvote', downvoteCount)}
        title={VOTE_ACTION_LABELS.downvote}
        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
      >
        <ThumbsDown className="w-4 h-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => castVote('flag')}
        disabled={isSubmitting}
        aria-label={getVoteAriaLabel('flag')}
        title={VOTE_ACTION_LABELS.flag}
        className="p-2 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
      >
        <Flag className="w-4 h-4" aria-hidden="true" />
      </button>

      {isSubmitting && (
        <Loader2
          className="w-4 h-4 text-gray-500 animate-spin"
          aria-label="Submitting vote"
          role="status"
        />
      )}
    </div>
  );
}
