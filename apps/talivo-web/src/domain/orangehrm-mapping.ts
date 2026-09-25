import type { SkillObservation } from './contracts.js';
export interface SkillExportRow {
  employeeId: string; skillId: string; yearsOfExperience: number | null; comments: string;
}
// Adapter-normalized EXPORT row, not a claim about an existing OrangeHRM REST response.
// Mirrors the inspected EmployeeSkill.php concepts without copying its implementation.
export function mapSkillObservation(tenantId: string, sourceInstanceId: string,
  row: SkillExportRow, importedAt: string): SkillObservation {
  if (![tenantId, sourceInstanceId, row.employeeId, row.skillId].every(s => typeof s === 'string' && s.trim()))
    throw new Error('Tenant, source instance, employee and skill identifiers are required.');
  if (!Number.isFinite(Date.parse(importedAt))) throw new Error('A valid import timestamp is required.');
  if (row.yearsOfExperience !== null && (!Number.isFinite(row.yearsOfExperience) || row.yearsOfExperience < 0))
    throw new Error('Years of experience must be a non-negative number or null.');
  const identity = (kind: string, id: string) => [tenantId, sourceInstanceId, kind, id].map(encodeURIComponent).join(':');
  return { tenantId, sourceSystem: 'orangehrm', sourceInstanceId,
    sourceRecordId: [tenantId, sourceInstanceId, 'employee-skill', row.employeeId, row.skillId].map(encodeURIComponent).join(':'),
    importedAt, contributorId: identity('employee', row.employeeId), skillId: identity('skill', row.skillId),
    yearsOfExperience: row.yearsOfExperience, sourceNote: row.comments,
    evidenceState: 'unvalidated', proficiencyLevel: null, assessorId: null };
}
