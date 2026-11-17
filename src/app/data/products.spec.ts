import { isHttpsUrl, isPlaceholder } from '../config/values';
import { formatPrice, PRODUCTS } from './products';

describe('products', () => {
  it('has unique slugs', () => {
    const slugs = PRODUCTS.map(p => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('gives every photo a non-empty alt', () => {
    for (const p of PRODUCTS) {
      if (p.photo) {
        expect(p.photo.alt.trim()).not.toBe('');
      }
    }
  });

  it('only keeps payment links that are placeholders or https URLs', () => {
    for (const p of PRODUCTS) {
      if (p.paymentLink !== undefined) {
        expect(isPlaceholder(p.paymentLink) || isHttpsUrl(p.paymentLink)).toBeTrue();
      }
    }
  });

  it('formats a missing price as "Prix à venir"', () => {
    expect(formatPrice(null)).toBe('Prix à venir');
  });

  it('formats a price in euros with fr-BE', () => {
    expect(formatPrice(2.5).replace(/\s/g, ' ')).toBe('2,50 €');
  });
});
