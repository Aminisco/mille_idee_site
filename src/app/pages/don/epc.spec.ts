import {
  buildEpcPayload,
  donationRemittance,
  formatIban,
  isValidBic,
  isValidIban,
  normalizeBic,
  normalizeIban,
  parseAmount,
} from './epc';

describe('IBAN helpers', () => {
  it('normalizes', () => {
    expect(normalizeIban(' be68 5390 0754 7034 ')).toBe('BE68539007547034');
  });
  it('validates with modulo 97', () => {
    expect(isValidIban('BE68 5390 0754 7034')).toBeTrue();
    expect(isValidIban('BE68 5390 0754 7035')).toBeFalse();
  });
  it('rejects too short or non alphanumeric input', () => {
    expect(isValidIban('BE68')).toBeFalse();
    expect(isValidIban('')).toBeFalse();
  });
  it('formats in groups of four', () => {
    expect(formatIban('BE68539007547034')).toBe('BE68 5390 0754 7034');
  });
});

describe('parseAmount', () => {
  it('handles empty, valid and invalid values', () => {
    expect(parseAmount('')).toEqual({ kind: 'empty' });
    expect(parseAmount('12,50')).toEqual({ kind: 'valid', value: 12.5 });
    expect(parseAmount(' 20 ')).toEqual({ kind: 'valid', value: 20 });
    for (const bad of ['0', '-5', 'abc', '12,345', '1000000000']) {
      expect(parseAmount(bad)).toEqual({ kind: 'invalid' });
    }
  });

  it('accepts the bounds and rejects what is just beyond', () => {
    expect(parseAmount('0,01')).toEqual({ kind: 'valid', value: 0.01 });
    expect(parseAmount('999999999,99')).toEqual({ kind: 'valid', value: 999999999.99 });
    expect(parseAmount('999999999,991')).toEqual({ kind: 'invalid' });
  });

  it('treats a trailing separator as a pending entry, not an error', () => {
    expect(parseAmount('12,')).toEqual({ kind: 'pending' });
    expect(parseAmount('12.')).toEqual({ kind: 'pending' });
    expect(parseAmount(',')).toEqual({ kind: 'invalid' });
    expect(parseAmount('12,,')).toEqual({ kind: 'invalid' });
  });
});

describe('donationRemittance', () => {
  it('builds the remittance', () => {
    expect(donationRemittance('')).toBe('Don');
    expect(donationRemittance('  Sarah\nB. ')).toBe('Don Sarah B.');
  });

  it('keeps only the SEPA Latin characters, without accents', () => {
    expect(donationRemittance('Zoé Ünal')).toBe('Don Zoe Unal');
    expect(donationRemittance('漢'.repeat(100))).toBe('Don');
    expect(donationRemittance('Léa 😀 K.')).toBe('Don Lea K.');
    expect(donationRemittance("O'Neil (Jr) +1")).toBe("Don O'Neil (Jr) +1");
  });

  it('caps the remittance at 140 characters', () => {
    expect(donationRemittance('N'.repeat(300)).length).toBe(140);
  });
});

describe('BIC helpers', () => {
  it('normalizes and validates', () => {
    expect(normalizeBic(' geba bebb ')).toBe('GEBABEBB');
    expect(isValidBic('gebabebb')).toBeTrue();
    expect(isValidBic('GEBABEBB123')).toBeTrue();
    expect(isValidBic('GEB@')).toBeFalse();
    expect(isValidBic('GEBABEB')).toBeFalse();
  });
});

describe('buildEpcPayload', () => {
  it('builds a full payload', () => {
    expect(
      buildEpcPayload({
        name: 'ASBL Mille Idées',
        iban: 'BE68 5390 0754 7034',
        bic: 'GEBABEBB',
        amount: 20,
        remittance: 'Don Sarah',
      }),
    ).toBe('BCD\n002\n1\nSCT\nGEBABEBB\nASBL Mille Idées\nBE68539007547034\nEUR20.00\n\n\nDon Sarah');
  });

  it('builds a payload without bic nor amount', () => {
    expect(buildEpcPayload({ name: 'ASBL Mille Idées', iban: 'BE68539007547034', remittance: 'Don' })).toBe(
      'BCD\n002\n1\nSCT\n\nASBL Mille Idées\nBE68539007547034\n\n\n\nDon',
    );
  });

  it('truncates the remittance to 140 characters', () => {
    const lines = buildEpcPayload({
      name: 'ASBL Mille Idées',
      iban: 'BE68539007547034',
      remittance: 'D'.repeat(200),
    }).split('\n');
    expect(lines[10].length).toBe(140);
  });

  it('truncates the name to 70 characters', () => {
    const lines = buildEpcPayload({ name: 'N'.repeat(100), iban: 'BE68539007547034' }).split('\n');
    expect(lines[5].length).toBe(70);
  });

  it('encodes a valid BIC in upper case and omits an invalid one', () => {
    const base = { name: 'ASBL Mille Idées', iban: 'BE68539007547034' };
    expect(buildEpcPayload({ ...base, bic: 'geba bebb' }).split('\n')[4]).toBe('GEBABEBB');
    expect(buildEpcPayload({ ...base, bic: 'GEB@' }).split('\n')[4]).toBe('');
  });

  it('cleans the remittance and keeps a 70-character donor name under 331 bytes', () => {
    const p = buildEpcPayload({
      name: 'ASBL Mille Idées',
      iban: 'BE68539007547034',
      bic: 'GEBABEBB',
      amount: 999999999.99,
      remittance: donationRemittance('é'.repeat(70)),
    });
    expect(p.split('\n')[10]).toBe('Don ' + 'e'.repeat(70));
    expect(new TextEncoder().encode(p).length).toBeLessThanOrEqual(331);
  });
});
