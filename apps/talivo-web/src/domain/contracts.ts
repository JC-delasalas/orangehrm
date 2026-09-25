export type Workspace = 'personal' | 'manager' | 'hrbp';
export interface Context { tenantId: string; actorId: string; workspace: Workspace; }
export interface Membership {
  tenantId: string; actorId: string; workspaces: readonly Workspace[];
  directReportIds: readonly string[]; clientGroupIds: readonly string[];
}
export interface Evidence {
  id: string; tenantId: string; subjectId: string; groupId: string;
  source: string; observedAt: string; summary: string;
  shared: boolean; current: boolean;
}
export type ReviewStatus = 'draft' | 'submitted' | 'changes_requested' | 'hr_cleared';
export interface Review {
  id: string; tenantId: string; subjectId: string; subjectName: string;
  groupId: string; managerId: string; managerName: string; hrReviewerId: string;
  version: number; status: ReviewStatus; statement: string;
  evidence: readonly Evidence[]; reviewNote: string;
}
export interface DecisionEvent {
  reviewId: string; tenantId: string; actorId: string; workspace: Workspace;
  version: number; action: string; reason: string;
}
export interface ReviewResult { review: Review; event: DecisionEvent; }
export interface SkillObservation {
  tenantId: string; sourceSystem: 'orangehrm'; sourceInstanceId: string;
  sourceRecordId: string; importedAt: string; contributorId: string;
  skillId: string; yearsOfExperience: number | null; sourceNote: string;
  evidenceState: 'unvalidated'; proficiencyLevel: null; assessorId: null;
}
