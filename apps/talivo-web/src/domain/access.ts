import type { Context, Membership, Review, Evidence } from './contracts.js';
// Demo/domain policy only. Production MUST enforce the equivalent rules on the server.
export function contextIsAllowed(context: Context, membership: Membership): boolean {
  return context.tenantId === membership.tenantId && context.actorId === membership.actorId
    && membership.workspaces.includes(context.workspace);
}
export function canReadEvidence(context: Context, membership: Membership, evidence: Evidence): boolean {
  if (!contextIsAllowed(context, membership) || evidence.tenantId !== context.tenantId) return false;
  if (context.workspace === 'personal') return evidence.subjectId === context.actorId;
  if (!evidence.shared || evidence.subjectId === context.actorId) return false;
  return context.workspace === 'manager'
    ? membership.directReportIds.includes(evidence.subjectId)
    : membership.clientGroupIds.includes(evidence.groupId);
}
export function canSubmit(context: Context, membership: Membership, review: Review): boolean {
  return contextIsAllowed(context, membership) && review.tenantId === context.tenantId
    && context.workspace === 'manager' && review.managerId === context.actorId
    && review.subjectId !== context.actorId && membership.directReportIds.includes(review.subjectId);
}
export function canReview(context: Context, membership: Membership, review: Review): boolean {
  return contextIsAllowed(context, membership) && review.tenantId === context.tenantId
    && context.workspace === 'hrbp' && review.hrReviewerId === context.actorId
    && review.managerId !== context.actorId && review.subjectId !== context.actorId
    && membership.clientGroupIds.includes(review.groupId);
}
