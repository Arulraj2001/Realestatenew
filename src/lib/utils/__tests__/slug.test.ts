import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import { generateSlug, isReservedSlug } from '../slug';

describe('Slug Utilities Unit Tests', () => {
  test('generates clean hyphenated URL slugs', () => {
    assert.equal(generateSlug('Royal Palms Avenue!'), 'royal-palms-avenue');
    assert.equal(generateSlug('  Paramathi   Velur Phase-1  '), 'paramathi-velur-phase-1');
  });

  test('detects reserved system routes correctly', () => {
    assert.equal(isReservedSlug('admin'), true);
    assert.equal(isReservedSlug('locations'), true);
    assert.equal(isReservedSlug('royal-palms'), false);
  });
});
