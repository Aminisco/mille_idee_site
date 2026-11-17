import { isHttpsUrl, isPlaceholder } from './values';

describe('isPlaceholder', () => {
  it('detects TODO, empty and blank values', () => {
    expect(isPlaceholder('TODO_IBAN')).toBeTrue();
    expect(isPlaceholder('  ')).toBeTrue();
    expect(isPlaceholder('')).toBeTrue();
    expect(isPlaceholder(undefined)).toBeTrue();
  });

  it('accepts a real value', () => {
    expect(isPlaceholder('BE68 5390 0754 7034')).toBeFalse();
  });
});

describe('isHttpsUrl', () => {
  it('accepts https only', () => {
    expect(isHttpsUrl('https://buy.stripe.com/abc')).toBeTrue();
    expect(isHttpsUrl('http://x.be')).toBeFalse();
    expect(isHttpsUrl('TODO_PAYMENT_LINK')).toBeFalse();
  });
});
