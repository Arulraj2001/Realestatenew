import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import { contactMessageSchema, siteVisitSchema } from '../messages';

describe('Validation Schemas Unit Tests', () => {
  test('validates correct contact submission', () => {
    const validData = {
      name: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      email: 'ramesh@example.com',
      message: 'Interested in 30x40 villa plot',
      consent: true,
    };

    const parsed = contactMessageSchema.parse(validData);
    assert.equal(parsed.name, 'Ramesh Kumar');
    assert.equal(parsed.consent, true);
  });

  test('fails contact submission without consent', () => {
    const invalidData = {
      name: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      consent: false,
    };

    assert.throws(() => contactMessageSchema.parse(invalidData));
  });

  test('validates correct site visit appointment', () => {
    const validVisit = {
      name: 'Priya Sundaram',
      phone: '9876543210',
      preferred_visit_date: '2026-08-01',
      preferred_visit_time: 'Morning',
      consent: true,
    };

    const parsed = siteVisitSchema.parse(validVisit);
    assert.equal(parsed.preferred_visit_time, 'Morning');
  });
});
