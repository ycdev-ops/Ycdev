import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLIENT_PORTAL_PROJECTS,
  buildDownloadFilename,
  buildSummaryPdfFilename,
  countCompletedMilestones,
  filterProjectDocuments,
  filterProjectMilestones,
} from './clientPortal';

test('CLIENT_PORTAL_PROJECTS contains active customer accounts with milestones and documents', () => {
  assert.ok(CLIENT_PORTAL_PROJECTS.length >= 4);
  for (const project of CLIENT_PORTAL_PROJECTS) {
    assert.ok(project.projectCode.startsWith('YCD-'));
    assert.ok(project.progressPct >= 0 && project.progressPct <= 100);
    assert.ok(project.milestones.length >= 3);
    assert.ok(project.documents.length >= 2);
  }
});

test('filterProjectMilestones filters accurately across all status types', () => {
  const pelindo = CLIENT_PORTAL_PROJECTS[0];
  assert.equal(filterProjectMilestones(pelindo.milestones, 'all').length, pelindo.milestones.length);
  assert.ok(filterProjectMilestones(pelindo.milestones, 'completed').every((m) => m.status === 'completed'));
  assert.ok(filterProjectMilestones(pelindo.milestones, 'in_progress').every((m) => m.status === 'in_progress'));
  assert.ok(filterProjectMilestones(pelindo.milestones, 'scheduled').every((m) => m.status === 'scheduled'));
});

test('filterProjectDocuments supports combined category filtering and case-insensitive search', () => {
  const pelindo = CLIENT_PORTAL_PROJECTS[0];
  const securityDocs = filterProjectDocuments(pelindo.documents, 'security', '');
  assert.equal(securityDocs.length, 1);
  assert.equal(securityDocs[0].code, 'DOC-PLD-SEC-02');

  const queryMatched = filterProjectDocuments(pelindo.documents, 'all', 'radar x-band');
  assert.equal(queryMatched.length, 1);
  assert.equal(queryMatched[0].code, 'DOC-PLD-ARCH-04');

  const emptyResult = filterProjectDocuments(pelindo.documents, 'all', 'dokumen-tidak-ada-xyz');
  assert.equal(emptyResult.length, 0);
});

test('countCompletedMilestones computes exact breakdown matching total length', () => {
  const pelindo = CLIENT_PORTAL_PROJECTS[0];
  const counts = countCompletedMilestones(pelindo.milestones);
  assert.equal(counts.completed, 2);
  assert.equal(counts.inProgress, 1);
  assert.equal(counts.scheduled, 1);
  assert.equal(counts.total, counts.completed + counts.inProgress + counts.scheduled);
});

test('buildDownloadFilename and buildSummaryPdfFilename format official lowercase PDF filenames', () => {
  const doc = CLIENT_PORTAL_PROJECTS[0].documents[0];
  assert.equal(buildDownloadFilename(doc), 'doc-pld-arch-04-v2.4.pdf');
  assert.equal(
    buildSummaryPdfFilename(CLIENT_PORTAL_PROJECTS[0].projectCode),
    'ycd-pld-2026-01-laporan-status-ycdev.pdf'
  );
});
