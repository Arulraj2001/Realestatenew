import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import { buildWhatsAppUrl, buildCallUrl } from '../whatsapp';

describe('WhatsApp and Call Helper Unit Tests', () => {
  test('builds contextual WhatsApp URL with property details', () => {
    const url = buildWhatsAppUrl({
      phone: '+91 98765 43210',
      projectName: 'Royal Avenue',
      locationName: 'Namakkal',
    });

    assert.ok(url.startsWith('https://wa.me/919876543210?text='));
    assert.ok(url.includes(encodeURIComponent('Royal Avenue')));
  });

  test('builds clean tel: call URI', () => {
    const callUrl = buildCallUrl('+91 98765 43210');
    assert.equal(callUrl, 'tel:+919876543210');
  });
});
