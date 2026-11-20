import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TEAM_BRIEFING_SHOWCASE,
  YCDEV_TEAM_MEMBERS,
  filterTeamMembers,
  formatTeamConsultationScope,
} from './teamCatalog';

test('YCDEV_TEAM_MEMBERS includes requested core specialists with exact uploaded photos and international members', () => {
  const byId = new Map(YCDEV_TEAM_MEMBERS.map((m) => [m.id, m]));

  const wiena = byId.get('wiena-kartika');
  assert.ok(wiena);
  assert.equal(wiena.name, 'Wiena Kartika');
  assert.match(wiena.role, /Tim Analis/i);
  assert.equal(wiena.imageUrl, '/assets/aistudio/1769705147195_ef5b239a.png');

  const ceilin = byId.get('ceilin-wu');
  assert.ok(ceilin);
  assert.equal(ceilin.name, 'Ceilin Wu');
  assert.match(ceilin.role, /Optic IoT Dev/i);
  assert.equal(ceilin.imageUrl, '/assets/aistudio/SmartSelect_20260213_024930_Gallery_ec6b3495.jpg');

  const hendra = byId.get('hendra-ansteinly');
  assert.ok(hendra);
  assert.equal(hendra.name, 'Hendra Ansteinly');
  assert.match(hendra.role, /Operator Satelit.*Radar/i);
  assert.equal(hendra.imageUrl, '/assets/aistudio/haidir_anto79-20260523-0002_0d3206c2.jpg');

  assert.equal(
    TEAM_BRIEFING_SHOWCASE.imageUrl,
    '/assets/aistudio/SmartSelect_20251201_044352_Chrome_75fb0ed7.jpg'
  );

  const intl = filterTeamMembers(YCDEV_TEAM_MEMBERS, 'international');
  assert.ok(intl.length >= 4);
  for (const member of intl) {
    assert.ok(member.imageUrl.startsWith('/src/assets/images/team_'));
    assert.ok(member.specialties.length >= 3);
  }
});

test('filterTeamMembers returns exact subsets by regionGroup', () => {
  const all = filterTeamMembers(YCDEV_TEAM_MEMBERS, 'all');
  const id = filterTeamMembers(YCDEV_TEAM_MEMBERS, 'indonesia');
  const intl = filterTeamMembers(YCDEV_TEAM_MEMBERS, 'international');

  assert.equal(all.length, id.length + intl.length);
  assert.equal(id.length, 3);
  assert.equal(intl.length, 4);
});

test('formatTeamConsultationScope includes specialist name, role, and location', () => {
  const scope = formatTeamConsultationScope(YCDEV_TEAM_MEMBERS[0]);
  assert.match(scope, /Wiena Kartika/);
  assert.match(scope, /Tim Analis/);
});
