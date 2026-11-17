import { isValidIban } from '../pages/don/epc';
import { DONATION_CONFIG } from './donation';
import { isHttpsUrl, isPlaceholder } from './values';

describe('DONATION_CONFIG', () => {
  it('has an IBAN that is a placeholder or valid', () => {
    expect(isPlaceholder(DONATION_CONFIG.iban) || isValidIban(DONATION_CONFIG.iban)).toBeTrue();
  });

  it('has a BIC that is a placeholder or well formed', () => {
    expect(
      isPlaceholder(DONATION_CONFIG.bic) ||
        /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(DONATION_CONFIG.bic),
    ).toBeTrue();
  });

  it('has a payment link that is a placeholder or https', () => {
    expect(isPlaceholder(DONATION_CONFIG.paymentLink) || isHttpsUrl(DONATION_CONFIG.paymentLink)).toBeTrue();
  });

  it('names the holder', () => {
    expect(DONATION_CONFIG.holder).toBe('ASBL Mille Idées');
  });
});
