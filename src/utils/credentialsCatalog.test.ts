import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CERTIFICATIONS,
  ENTERPRISE_CUSTOMERS,
  FOUNDER_EXECUTIVE_PROFILE,
  GLOBAL_PARTNERS,
  filterCertifications,
  filterEnterpriseCustomers,
  formatCustomerInquiryScope,
} from './credentialsCatalog';

test('CERTIFICATIONS covers all 5 engineering domains with unique credential codes', () => {
  const domains = new Set(CERTIFICATIONS.map((c) => c.domain));
  assert.deepEqual(
    [...domains].sort(),
    ['cybersecurity', 'fullstack', 'iot', 'maritime', 'software']
  );

  const codes = new Set(CERTIFICATIONS.map((c) => c.credentialCode));
  const seals = new Set(CERTIFICATIONS.map((c) => c.sealVariant));
  const registries = new Set(CERTIFICATIONS.map((c) => c.registryUrl));
  assert.equal(codes.size, CERTIFICATIONS.length);
  assert.equal(seals.size, CERTIFICATIONS.length);
  assert.equal(registries.size, CERTIFICATIONS.length);
  assert.equal(filterCertifications(CERTIFICATIONS, 'all').length, CERTIFICATIONS.length);
  assert.ok(filterCertifications(CERTIFICATIONS, 'cybersecurity').length >= 2);
  CERTIFICATIONS.forEach((cert) => {
    assert.equal(cert.holderName, 'Yuan Nugroho');
    assert.ok(cert.issuedDate.length > 0);
    assert.ok(cert.signatoryName.length > 0);
  });
});

test('FOUNDER_EXECUTIVE_PROFILE highlights Yuan Nugroho autodidact engineering background', () => {
  assert.equal(FOUNDER_EXECUTIVE_PROFILE.fullName, 'Yuan Nugroho');
  assert.match(FOUNDER_EXECUTIVE_PROFILE.executiveSummary.toLowerCase(), /autodidak/);
  assert.ok(FOUNDER_EXECUTIVE_PROFILE.milestones.length >= 4);
  assert.ok(GLOBAL_PARTNERS.length >= 6);
});

test('ENTERPRISE_CUSTOMERS includes Pelindo, Pemerintah, Tesla, and foreign enterprise clients with photos', () => {
  const sectors = new Set(ENTERPRISE_CUSTOMERS.map((c) => c.sector));
  assert.deepEqual([...sectors].sort(), ['global', 'pelindo', 'pemerintah', 'tesla']);

  assert.equal(filterEnterpriseCustomers(ENTERPRISE_CUSTOMERS, 'pelindo').length, 1);
  assert.equal(filterEnterpriseCustomers(ENTERPRISE_CUSTOMERS, 'pemerintah').length, 1);
  assert.equal(filterEnterpriseCustomers(ENTERPRISE_CUSTOMERS, 'tesla').length, 1);
  assert.ok(filterEnterpriseCustomers(ENTERPRISE_CUSTOMERS, 'global').length >= 3);

  ENTERPRISE_CUSTOMERS.forEach((customer) => {
    assert.ok(customer.imageUrl.length > 0, `Missing imageUrl for ${customer.id}`);
    assert.ok(customer.imageAlt.length > 0, `Missing imageAlt for ${customer.id}`);
  });

  const tesla = filterEnterpriseCustomers(ENTERPRISE_CUSTOMERS, 'tesla')[0];
  assert.match(formatCustomerInquiryScope(tesla), /Tesla/);
});
