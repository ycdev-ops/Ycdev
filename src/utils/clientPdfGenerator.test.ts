import test from 'node:test';
import assert from 'node:assert/strict';
import { CLIENT_PORTAL_PROJECTS } from './clientPortal';
import {
  YCDEV_OFFICIAL_LOGO_URL,
  buildClientDocumentPdfPayload,
  buildClientSummaryPdfPayload,
} from './clientPdfGenerator';

test('YCDEV_OFFICIAL_LOGO_URL points to the official user-provided YcDev emblem', () => {
  assert.equal(
    YCDEV_OFFICIAL_LOGO_URL,
    '/assets/aistudio/SmartSelect_20261115_111928_Gallery_7ef9e0a2.png'
  );
});

test('buildClientDocumentPdfPayload generates PDF metadata and clean .pdf filename', () => {
  const project = CLIENT_PORTAL_PROJECTS[0];
  const doc = project.documents[0];
  const payload = buildClientDocumentPdfPayload(project, doc);

  assert.equal(payload.filename, 'doc-pld-arch-04-v2.4.pdf');
  assert.equal(payload.title, doc.title);
  assert.ok(payload.metadataRows.some((r) => r.value.includes(project.clientName)));
  assert.ok(payload.metadataRows.some((r) => r.value.includes(doc.sha256Short)));
  assert.ok(payload.sections.length >= 2);
});

test('buildClientSummaryPdfPayload includes all project milestones and official summary .pdf filename', () => {
  const project = CLIENT_PORTAL_PROJECTS[0];
  const payload = buildClientSummaryPdfPayload(project);

  assert.equal(payload.filename, 'ycd-pld-2026-01-laporan-status-ycdev.pdf');
  assert.ok(payload.sections[1].lines.some((l) => l.includes(project.milestones[0].title)));
  assert.ok(payload.verificationCode.includes(project.projectCode));
});
