# Talivo React foundation

An additive Next.js / React / TypeScript workspace beside the untouched OrangeHRM application. It is NOT a completed Vue migration and NOT a live AI or HR system.

## Run locally

Use Node.js 22.12+ and npm, then from this directory:

```sh
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

Open http://localhost:3100. Dependencies are bounded major ranges. The first successful installation must generate and commit `package-lock.json`; subsequent CI should use `npm ci`. No lockfile is invented here. Review resolved packages before deployment.

## Included

- Separate company and workspace controls: My Talivo, Team Pulse, The Briefing.
- The seven Talivo module names and their implementation boundaries.
- Small interactive performance example: manager submits; an independent HR reviewer requests evidence or records HR clearance.
- Plain TypeScript domain policies, version checks and a tested skill-import mapping example.
- Synthetic state for two companies. Switching companies does not reuse the other company's notes or review state.

The same signed-in fictional person has different responsibilities. Manager and HRBP screens deliberately show different people. No control impersonates another reviewer. To replay a completed example, reset the sample company.

## Not included

Live login, server-side authorization, Supabase, Snowflake, actual OrangeHRM API calls, LLM calls, background workers, production approval security, and migration of the previous full HTML prototype. Five source categories and every legacy screen are not implemented. Other module panels explicitly remain planned.

Do not enter real people information. All state is in browser memory and disappears on refresh. Client-side scoping is not data isolation against an attacker.

## Why a separate application?

Preserve the existing PHP/Vue runtime and treat OrangeHRM as an optional source system and workflow reference. Build Talivo's independent evidence, options, approvals and outcomes. Do not rebuild leave, payroll or recruiting administration.

Production data remains the approved Talivo model. The example adapter does not convert years of experience into verified proficiency. Future adapters must enforce source authorization, pagination, freshness and identity mapping server-side.

## License and verification

The repository's existing LICENSE is unchanged. Do not interpret folder separation or a framework rewrite as removal of upstream obligations. This starter imports no OrangeHRM/OXD source or assets. Component-by-component reuse and the commercial distribution model need a separate license review.

Initial verification is documented in `../../docs/talivo/REPOSITORY_AUDIT.md`. Domain tests can run without network if `tsc` is available; the React build still requires installation of the declared packages.
