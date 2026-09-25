"use client";
import { useState } from 'react';
import type { Context, Membership, Review, DecisionEvent, Workspace } from '../domain/contracts';
import { canSubmit, canReview, canReadEvidence } from '../domain/access';
import { hrReview, submitReview } from '../domain/review';
import { modules } from '../domain/catalog';

const labels: Record<Workspace, string> = { personal: 'My Talivo', manager: 'Team Pulse', hrbp: 'The Briefing' };
const displayStatus: Record<Review['status'], string> = { draft: 'Manager draft', submitted: 'Needs HR review', changes_requested: 'Evidence requested', hr_cleared: 'HR review complete' };
function seed(tenantId: string): Review[] {
  const actor = `${tenantId}:alex`;
  return [
    { id: `${tenantId}:R1`, tenantId, subjectId: `${tenantId}:jordan`, subjectName: 'Jordan Lee', groupId: 'engineering', managerId: `${tenantId}:priya`, managerName: 'Priya Shah', hrReviewerId: actor, version: 1, status: 'submitted', statement: 'The milestone was missed. I would like to discuss ownership of the dependency.', reviewNote: '', evidence: [
      { id: `${tenantId}:E1`, tenantId, subjectId: `${tenantId}:jordan`, groupId: 'engineering', source: 'Sample goal record', observedAt: '2026-09-25', summary: 'The milestone was missed. A required input arrived four days late.', shared: true, current: true },
    ] },
    { id: `${tenantId}:R2`, tenantId, subjectId: `${tenantId}:dana`, subjectName: 'Dana Patel', groupId: 'people', managerId: actor, managerName: 'Alex Morgan', hrReviewerId: `${tenantId}:morgan`, version: 1, status: 'draft', statement: 'Dana completed the agreed onboarding analysis and documented remaining gaps.', reviewNote: '', evidence: [
      { id: `${tenantId}:E2`, tenantId, subjectId: `${tenantId}:dana`, groupId: 'people', source: 'Sample work record', observedAt: '2026-09-24', summary: 'An approved work example supports the completed analysis. This is not a performance rating.', shared: true, current: true },
    ] },
  ];
}
export default function WorkspaceShell() {
  const [tenantId, setTenant] = useState('northstar');
  const [workspace, setWorkspace] = useState<Workspace>('hrbp');
  const [moduleId, setModule] = useState('performance');
  const [records, setRecords] = useState<Record<string, Review[]>>({ northstar: seed('northstar'), lumen: seed('lumen') });
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [log, setLog] = useState<DecisionEvent[]>([]);
  const [message, setMessage] = useState('');
  const context: Context = { tenantId, actorId: `${tenantId}:alex`, workspace };
  const membership: Membership = { tenantId, actorId: context.actorId, workspaces: ['personal','manager','hrbp'], directReportIds: [`${tenantId}:dana`], clientGroupIds: ['engineering'] };
  const module = modules.find(m => m.id === moduleId)!;
  const reviews = records[tenantId].filter(r => workspace === 'manager' ? canSubmit(context, membership, r) : workspace === 'hrbp' ? canReview(context, membership, r) : false);
  function act(review: Review, action: 'submit' | 'request_evidence' | 'clear') {
    try {
      const result = action === 'submit' ? submitReview(context, membership, review, review.version)
        : hrReview(context, membership, review, review.version, action, notes[review.id] || '');
      setRecords(old => ({ ...old, [tenantId]: old[tenantId].map(r => r.id === review.id ? result.review : r) }));
      setLog(old => [...old, result.event]);
      setMessage('Recorded in this sample session. No source system was changed.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'The action could not be recorded.'); }
  }
  const scope = workspace === 'personal' ? 'Your own information' : workspace === 'manager' ? 'People Partnering · direct reports' : 'Engineering · assigned client group';
  return <div className="shell">
    <a className="skip" href="#content">Skip to content</a>
    <aside>
      <div className="brand"><span aria-hidden="true">///</span> talivo</div>
      <label>Sample company<select value={tenantId} onChange={e => { setTenant(e.target.value); setMessage(''); }}><option value="northstar">Northstar · sample</option><option value="lumen">Lumen · sample</option></select></label>
      <label>Workspace<select value={workspace} onChange={e => { setWorkspace(e.target.value as Workspace); setMessage(''); }}>{Object.entries(labels).map(([id,name]) => <option key={id} value={id}>{name}</option>)}</select></label>
      <p className="nav-label">CONNECTED TALENT MODULES</p>
      <nav aria-label="Talent modules">{modules.map(m => <button key={m.id} aria-current={moduleId === m.id ? 'page' : undefined} onClick={() => { setModule(m.id); setMessage(''); }}>{m.name}</button>)}</nav>
      <div className="account"><strong>Alex Morgan</strong><small>One person. Separate responsibilities.</small></div>
    </aside>
    <div className="body">
      <header><span>{labels[workspace]} <span className="muted">/ {scope}</span></span><span className="badge">React foundation · sample only</span></header>
      <main id="content">
        <div className="heading"><div><p className="eyebrow">INTELLIGENCE PREPARES. PEOPLE DECIDE.</p><h1>{workspace === 'personal' ? 'Make room for your next step.' : workspace === 'manager' ? 'Your team. Your decisions.' : 'Review what needs your judgment.'}</h1><p>{workspace === 'hrbp' ? 'Challenge the evidence without taking over the manager’s assessment.' : workspace === 'manager' ? 'Prepare and submit the assessment. Keep ownership of the employee conversation.' : 'Your career notes stay in this personal sample view until you choose a sharing route.'}</p></div></div>
        <div className="banner"><strong>Initialization, not a completed migration.</strong><p>No live AI, authentication, database or OrangeHRM connection. All names and observations are synthetic. Client-side checks demonstrate the intended behavior, not production security.</p></div>
        <section className="module-head"><div><p className="eyebrow">{module.name}</p><h2>{module.question}</h2><p>{module.source}</p></div><span className="badge">{module.id === 'performance' ? 'Interaction example' : 'Migration planned'}</span></section>
        {workspace === 'personal' ? <section className="card"><h2>My private career draft</h2><p>This is a local sample, not saved to a server. Switching responsibilities does not publish the note.</p><label htmlFor="career">What would you like to explore?</label><textarea id="career" value={drafts[tenantId] || ''} onChange={e => setDrafts(old => ({...old,[tenantId]:e.target.value}))} placeholder="Use fictional information only."/><small>Not shared · cleared when the page is reloaded · never sent to an AI provider</small></section>
        : moduleId !== 'performance' ? <section className="card"><h2>Keep this domain connected</h2><p>This module is defined but its screens are not migrated in this initialization. The first working slice is a manager submission and independent HR evidence review.</p><button className="primary" onClick={() => setModule('performance')}>Open the performance example</button></section>
        : <div className="review-list">{reviews.map(review => <section className="card" key={review.id}>
          <div className="card-heading"><div><p className="eyebrow">{displayStatus[review.status]} · Version {review.version}</p><h2>{review.subjectName}</h2><p>Assessment owner: {review.managerName}</p></div><span className="badge">No rating changed</span></div>
          <blockquote>{review.statement}</blockquote>
          <h3>Evidence available to this workspace</h3>{review.evidence.filter(e => canReadEvidence(context,membership,e)).map(e => <div className="evidence" key={e.id}><strong>{e.source}</strong><time>{e.observedAt}</time><p>{e.summary}</p></div>)}
          {workspace === 'hrbp' && <div className="question"><strong>Prepared question · synthetic example, not live AI</strong><p>Which expectations remained within the employee’s control, and what supports the ownership concern?</p></div>}
          {review.reviewNote && <div className="question"><strong>HR review note</strong><p>{review.reviewNote}</p></div>}
          {workspace === 'manager' ? <div className="actions"><button className="primary" disabled={!['draft','changes_requested'].includes(review.status)} onClick={() => act(review,'submit')}>Submit manager assessment</button><small>HR review belongs to a different person.</small></div>
          : <><label htmlFor={`note-${review.id}`}>Your evidence question or clearance reason</label><textarea id={`note-${review.id}`} value={notes[review.id] || ''} onChange={e => setNotes(old => ({...old,[review.id]:e.target.value}))} placeholder="Be specific about the evidence or issue."/><div className="actions"><button disabled={review.status !== 'submitted'} onClick={() => act(review,'request_evidence')}>Request evidence</button><button className="primary" disabled={review.status !== 'submitted'} onClick={() => act(review,'clear')}>Record HR clearance</button></div><small>Clearance is not a final rating, promotion approval or source-system update.</small></>}
        </section>)}</div>}
        <div role="status" aria-live="polite" className="status">{message}</div>
        <details className="card"><summary>Sample activity for this workspace</summary>{log.filter(e => e.tenantId === tenantId && e.workspace === workspace).length === 0 ? <p>No actions recorded here yet.</p> : <ul>{log.filter(e => e.tenantId === tenantId && e.workspace === workspace).map((e,i) => <li key={i}>{e.action.replaceAll('_',' ')} · v{e.version} · {e.reason}</li>)}</ul>}</details>
        <footer><span>Browser-only state · no external writes</span><button onClick={() => { setRecords(old => ({...old,[tenantId]:seed(tenantId)})); setNotes(old => Object.fromEntries(Object.entries(old).filter(([id]) => !id.startsWith(tenantId+':')))); setDrafts(old => ({...old,[tenantId]:''})); setLog(old => old.filter(e => e.tenantId !== tenantId)); setMessage('This sample company has been reset.'); }}>Reset this sample company</button></footer>
      </main>
    </div>
  </div>;
}
