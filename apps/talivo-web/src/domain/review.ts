import type { Context, Membership, Review, ReviewResult } from './contracts.js';
import { canSubmit, canReview, canReadEvidence } from './access.js';
const requiredReason = (reason: string): string => {
  if (!reason.trim()) throw new Error('Add the specific reason or evidence question.');
  return reason.trim();
};
export function submitReview(context: Context, membership: Membership, review: Review, expectedVersion: number): ReviewResult {
  if (!canSubmit(context, membership, review)) throw new Error('Only the assigned manager can submit this review.');
  if (review.version !== expectedVersion) throw new Error('The review changed. Read the current version first.');
  if (!['draft', 'changes_requested'].includes(review.status)) throw new Error('This review cannot be submitted from its current state.');
  if (!review.statement.trim()) throw new Error('The manager must provide their assessment.');
  if (!review.evidence.some(e => e.current && canReadEvidence(context, membership, e))) throw new Error('Attach current, permitted evidence before submission.');
  return { review: { ...review, status: 'submitted', version: review.version + 1, reviewNote: '' },
    event: { ...context, reviewId: review.id, version: review.version + 1, action: 'manager_submitted', reason: 'Manager submitted their assessment.' } };
}
export function hrReview(context: Context, membership: Membership, review: Review, expectedVersion: number,
  decision: 'request_evidence' | 'clear', reason: string): ReviewResult {
  if (!canReview(context, membership, review)) throw new Error('An independent, assigned HR reviewer is required.');
  if (review.version !== expectedVersion) throw new Error('The review changed. Read the current version first.');
  if (review.status !== 'submitted') throw new Error('The manager must submit this review first.');
  if (decision !== 'request_evidence' && decision !== 'clear') throw new Error('Unsupported review decision.');
  const note = requiredReason(reason);
  if (decision === 'clear' && !review.evidence.some(e => e.current && canReadEvidence(context, membership, e)))
    throw new Error('Current evidence must be available before HR clearance.');
  return { review: { ...review, status: decision === 'clear' ? 'hr_cleared' : 'changes_requested', reviewNote: note },
    event: { ...context, reviewId: review.id, version: review.version, action: decision === 'clear' ? 'hr_cleared' : 'evidence_requested', reason: note } };
}
export function reviseAssessment(context: Context, membership: Membership, review: Review, statement: string): Review {
  if (!canSubmit(context, membership, review)) throw new Error('The assigned manager owns the assessment.');
  if (!statement.trim()) throw new Error('Assessment cannot be empty.');
  return { ...review, statement: statement.trim(), status: 'draft', version: review.version + 1, reviewNote: '' };
}
// A frontend review status never authorizes an HCM change. Future server workflow owns write-back.
export function canWriteToSource(): false { return false; }
