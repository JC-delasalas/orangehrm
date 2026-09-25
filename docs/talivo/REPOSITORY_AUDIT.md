# OrangeHRM to Talivo: repository audit and initialization

Date: 25 September 2026  
Repository: `JC-delasalas/orangehrm`  
Audited commit: `56e23b3b09e7af29317a0943523b825843fff527`  
Feature branch: `TALIVO-001-react-foundation`  
Status: source audit and additive React foundation, not a completed conversion.

## Decision

Use this repository selectively. Keep OrangeHRM unchanged as a source-system reference and an optional integration test system. Initialize Talivo's React experience separately in `apps/talivo-web`.

Do not port every OrangeHRM screen. The repository has useful employee, review and recruitment foundations, but its inspected implementation does not establish Talivo's evidence-backed capability model, supported career trials, succession rehearsals, cross-system investigations or multi-tenant approval system. A React rewrite of HR administration would still be HR administration.

Talivo may own its insights, investigation drafts, approval records, commitments and outcome reviews. It may store permitted copies and references from external systems. It does not become the authoritative employee, applicant, payroll or accounting database merely because those entities can be displayed in React.

## What the code actually shows

All repository references below are pinned to the audited commit, not to a moving branch.

| Finding | Inspected source | Consequence |
|---|---|---|
| Vue 3 client, Vue CLI build, TypeScript, Yarn 4.1.0, and `@ohrm/oxd` 2.0.3 | [client package](https://github.com/JC-delasalas/orangehrm/blob/56e23b3b09e7af29317a0943523b825843fff527/src/client/package.json) | This is not an existing React application. Vue components, component plugins and page wiring need replacement for selected journeys. |
| Vue boot depends on `window.appGlobal.baseUrl`, global page registration, translation and ACL plugins | [main.ts](https://github.com/JC-delasalas/orangehrm/blob/56e23b3b09e7af29317a0943523b825843fff527/src/client/src/main.ts) | A framework migration involves page boot, routing, permissions, localization and request handling, not just template syntax. |
| The client API wrapper imports Vue's `getCurrentInstance` and local browser storage | [APIService](https://github.com/JC-delasalas/orangehrm/blob/56e23b3b09e7af29317a0943523b825843fff527/src/client/src/core/util/services/api.service.ts) | Even a TypeScript service is not necessarily framework-neutral or tenant-safe to copy. Introduce a separate adapter. |
| PHP application uses Symfony 5.4 components and Doctrine ORM 2.20 in the manifest | [Composer](https://github.com/JC-delasalas/orangehrm/blob/56e23b3b09e7af29317a0943523b825843fff527/src/composer.json) | React does not replace backend rules, database access, sessions or API permission checks. Exact installed versions require the lockfile/install audit. |
| The root Dockerfile downloads OrangeHRM 5.9 from SourceForge into an Apache/PHP 8.3 image | [Dockerfile](https://github.com/JC-delasalas/orangehrm/blob/56e23b3b09e7af29317a0943523b825843fff527/Dockerfile) | It does not build or copy the edited repository application. A successful root Docker build would not validate Talivo or source edits. |
| EmployeeSkill records employee, skill, years of experience and comments | [EmployeeSkill](https://github.com/JC-delasalas/orangehrm/blob/56e23b3b09e7af29317a0943523b825843fff527/src/plugins/orangehrmPimPlugin/entity/EmployeeSkill.php) | There is no assessed proficiency, assessor, assessment date or evidence link in this entity. Import it as an unvalidated observation, not a verified skill. |
| JobTitle holds name, description, note and employee relationships | [JobTitle](https://github.com/JC-delasalas/orangehrm/blob/56e23b3b09e7af29317a0943523b825843fff527/src/plugins/orangehrmAdminPlugin/entity/JobTitle.php) | A shared job title is not an independently approved position. Do not map it directly to a Talivo Role/seat. |
| PerformanceReview has employee, period, status, ratings, comment, reviewers, job title and subunit | [PerformanceReview](https://github.com/JC-delasalas/orangehrm/blob/56e23b3b09e7af29317a0943523b825843fff527/src/plugins/orangehrmPerformancePlugin/entity/PerformanceReview.php) | Existing reviews can become source evidence; contextual investigation, evidence challenges and separate HR clearance need Talivo behavior. |
| Vacancy references a JobTitle and hiring manager and can contain multiple positions | [Vacancy](https://github.com/JC-delasalas/orangehrm/blob/56e23b3b09e7af29317a0943523b825843fff527/src/plugins/orangehrmRecruitmentPlugin/entity/Vacancy.php) | A vacancy is not automatically one funded seat. Explicit opening-to-role mappings are required. |
| GPL v3 root license; Composer and PHP headers specify GPL-3.0-or-later | [LICENSE](https://github.com/JC-delasalas/orangehrm/blob/56e23b3b09e7af29317a0943523b825843fff527/LICENSE), Composer and entity headers above | Preserve notices and examine copied code, frontend bundles, dependencies and distribution before commercialization. |

The client package's version is `5.0.0`, while the Dockerfile selects distribution `5.9`. Neither alone identifies the entire checkout. Use the commit SHA as the audit baseline.

Repository docs describe a Docker-based source development environment through the companion development repository. Do not substitute the packaged-release Dockerfile for it. See [AGENTS.md](https://github.com/JC-delasalas/orangehrm/blob/56e23b3b09e7af29317a0943523b825843fff527/AGENTS.md).

## Feature reuse map

This table distinguishes source records and implementation references from complete Talivo capabilities. It is not an audit of OrangeHRM's separately sold editions.

| Talivo module | Useful OrangeHRM foundation | What remains Talivo work |
|---|---|---|
| Talent Capability | Employee, qualification and skill records | Evidence states, assessed proficiency, freshness, responsibility-level requirements, conditional readiness and correction propagation. |
| Career Growth | Employee/job context | Private interests, feasible opportunities, supported trials, source-team coverage, versioned agreements and follow-up outcomes. |
| Performance | Review, reviewer, KPI and tracker structures | Manager-owned submissions, evidence-linked preparation, contextual investigation, HR questions, independent approvals and review/source-state separation. |
| Succession | Employee and job context | Critical seats, target-role candidates, availability, overlapping backup dependencies and rehearsed responsibility coverage. No complete equivalent was established in the inspected Starter code. |
| Employee Experience | Organization/employee scope | Approved feedback aggregates, disclosure protection, organizational commitments and outcome evaluation. Social posts or attendance are not survey evidence. |
| Hiring Intelligence | Vacancies and recruitment records | Staffing-date context, interview bottlenecks, external scheduling evidence, alternatives and approved handoffs. Keep the ATS as the process owner. |
| Talent Investment | Permitted workforce context | Approved budgets, period-aligned financial actuals, cost assumptions and costed options. No equivalent finance-planning layer was established in this audit. |

Leave, attendance, timesheets, claims, routine personal-data editing and social-feed administration should not become Talivo's main navigation. Read relevant, permitted context only when it changes a talent investigation. Do not convert activity into contribution or private attitude scores.

## Data mapping: preserve Talivo's model

The team-owned data specification stays authoritative for Talivo. Reuse does not mean swapping in OrangeHRM's schema.

- Employee -> a permitted subset of Contributor, with source instance and external ID. Do not duplicate sensitive identity fields by default.
- Subunit -> candidate Organization mapping after hierarchy and date validation.
- JobTitle -> partial Job Profile context. Do not manufacture Role, capacity or effective-dated Role Assignment from a title alone.
- EmployeeSkill -> Skill Observation / Skill Proposal. Years of experience is not proficiency. Import time is not assessment time. The starter includes a tested example.
- PerformanceReview -> dated source review evidence. Preserve its original rating scale and period. HR clearance, employee acknowledgment and final source outcome remain different facts.
- Vacancy -> recruitment need or opening group. Map constituent openings to approved seats explicitly; do not equate `numOfPositions` with approved headcount.
- Source salary, budget and ledger facts, when later connected, require separate definitions; they must not be summed blindly.

Missing facts remain unknown. Do not fill mandatory fields with invented assessments. Identifiers include company and source instance. Canonical identity merges require an authorized mapping rather than name-only matching.

## Proposed architecture

```text
My Talivo / Team Pulse / The Briefing
              |
       React / Next.js
              |
       Talivo application API
       |               |
  evidence + rules   AI investigation + durable workflow
       |               |
  approved Talivo data model, insight/decision/outcome records
              |
       source-specific adapters
       |       |       |       |       |       |
 OrangeHRM  Workday Greenhouse GoodTime Peakon NetSuite
```

Only the React foundation and dependency-free domain examples are initialized here. The API, workers, databases and connectors in this diagram are proposed work.

OrangeHRM should be optional, not a required backend for every Talivo customer. Its single-source record model must not dictate the multi-tenant intelligence model. Retain PHP/MySQL for an OrangeHRM test instance when useful. Build Talivo's own Supabase demo schema independently and retain the planned Snowflake migration as a separate, tested workstream. Do not combine a frontend migration, a PHP rewrite and a MySQL-to-Postgres migration in one change.

Next.js retains the previously selected React application direction. A separate root app can coexist with the legacy site or later be reverse-proxied under a dedicated path. Do not put React inside every Vue component. React's official guide supports adding a separate React part to an existing application: https://react.dev/learn/add-react-to-an-existing-project

## Manager-led performance slice

1. The manager authors the assessment. Talivo assembles permitted evidence and identifies unanswered questions.
2. The manager reviews the preparation and submits a version.
3. The assigned HRBP requests specific evidence or records the delegated HR review. They do not rewrite the manager's rating silently.
4. The manager owns the response and any revised assessment. New material content invalidates prior clearance.
5. Final rating, promotion or funding approval follows the customer's named authority. Employee acknowledgment is not agreement.
6. An approved source request remains pending until the designated system confirms effect.

The sample UI illustrates steps 2 and 3 on different employee records for the same fictional person. It does not impersonate a second approver. Current checks are front-end/domain examples, not production authorization.

## AI integration must be new shared infrastructure

Source change -> scoped evidence retrieval -> rules and bounded AI investigation -> options checked by code -> human decision -> approved workflow -> source confirmation -> outcome review.

Use one recipe/tool framework across modules, not seven chatbots. LLM calls belong on the server through an approved provider adapter. Deterministic calculations own dates, allocation and costs. The model receives no admin database key or arbitrary write tool. It can prepare a review question without owning the performance judgment.

Use the actual source endpoint capability inventory before promising an external write. A request timeout is not failure certainty or success. Retrying must not repeat an effective change.

## Multi-tenant and access work

The inspected entity fields and existing permission model do not establish Talivo's end-to-end tenant separation. Treat this as new required architecture, not a claim that adding `tenant_id` to a few tables completes it.

Verify company, actual actor, responsibility, population, record purpose, field access and effective dates on the server and every AI tool. Apply the same context to storage, search, queues, caches, exports and notifications. Do not translate OrangeHRM Admin into unrestricted HRBP access. Client groups are not direct reports. Switching workspaces cannot satisfy independent approvals or access another customer's data.

## License boundary

GPL is compatible with commercial use, but is not a permissive license. The root license defines network interaction without transfer of a copy differently from conveying copies. Browser-delivered derived JavaScript and customer-distributed packages therefore need specific review; hosting is not a blanket answer. A React rewrite does not automatically remove obligations for adapted code. API separation and folder separation do not, by themselves, decide whether works are independent. Review upstream/OXD dependencies and branding separately before copying them. This is an engineering risk flag, not a legal opinion.

Existing license files are unchanged. This starter imports no OrangeHRM/OXD code or assets. No confidential PRDs, customer data or original uploaded design files are included in the repository changes. The commercial licensing decision remains with the owner after appropriate review.

## Sequence with acceptance gates

| Step | Deliverable | Gate |
|---|---|---|
| 0. Audit and isolated foundation | This branch, source findings, React starter and policy/mapping tests | Upstream tree untouched; exact base recorded. |
| 1. Complete React experience | Port selected team-owned HTML prototype journeys to reusable components; all three workspaces | Evidence, options, manager submission, HR challenge and outcome screens tested with people. No empty module presented as finished. |
| 2. One read-only source adapter | OrangeHRM employee/review/recruiting fixture export or an authorized API | Real pagination, permissions, identity, dates and contract tests. No guessed endpoint or administrative credential in browser. |
| 3. Talivo-owned application data | Supabase, source projection, independent policies and role/seat/assignment relationships | Server-side and database negative access tests for two companies and self-review conflicts. |
| 4. Integrated AI and workflow | A source event triggers preparation, specific human checkpoint and permitted mock source action | No-chat-trigger test, model outage, changed evidence, refused approval, retry and source confirmation. |
| 5. Controlled live pilot | Approved source integrations, outcome evidence and measured user effort | Prove useful decisions and lower burden, not number of forms or AI answers. |

## What has and has not been verified

Completed locally: isolated starter files generated; TypeScript domain compilation; 20 Node unit tests of scope, independent review, version handling and skill mapping; TSX syntax checks.

Not completed: cloning the full repo (GitHub DNS is unavailable in this runtime), dependency installation, full Next.js typecheck/build, browser tests, OrangeHRM installation, backend tests, security assessment, dependency vulnerability scan, real source/LLM calls or production deployment. Remote branch initialization uses the working GitHub connector.

Source audit includes manifests, entry point, request wrapper, repository guidance, license, Dockerfile, plugin inventory and the named entity samples. It is not a file-by-file audit, proof of feature absence everywhere, or a claim about paid OrangeHRM editions.
