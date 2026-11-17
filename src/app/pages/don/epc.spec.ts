import {
  buildEpcPayload,
  donationRemittance,
  formatIban,
  isValidIban,
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
});

describe('donationRemittance', () => {
  it('builds the remittance', () => {
    expect(donationRemittance('')).toBe('Don');
    expect(donationRemittance('  Sarah\nB. ')).toBe('Don Sarah B.');
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
});
