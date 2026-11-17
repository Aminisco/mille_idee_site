export function normalizeIban(raw: string): string {
  return raw.replace(/\s+/g, '').toUpperCase();
}

export function isValidIban(raw: string): boolean {
  const iban = normalizeIban(raw);
  if (iban.length < 15 || iban.length > 34 || !/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) {
    return false;
  }
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const digits = ch >= 'A' ? String(ch.charCodeAt(0) - 55) : ch;
    for (const d of digits) {
      remainder = (remainder * 10 + Number(d)) % 97;
    }
  }
  return remainder === 1;
}

export function formatIban(raw: string): string {
  return normalizeIban(raw).replace(/(.{4})(?=.)/g, '$1 ');
}

export type AmountResult =
  | { kind: 'empty' }
  | { kind: 'valid'; value: number }
  | { kind: 'invalid' };

export function parseAmount(raw: string): AmountResult {
  const cleaned = raw.replace(/\s+/g, '').replace(',', '.');
  if (cleaned === '') {
    return { kind: 'empty' };
  }
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) {
    return { kind: 'invalid' };
  }
  const value = Number(cleaned);
  if (value < 0.01 || value > 999_999_999.99) {
    return { kind: 'invalid' };
  }
  return { kind: 'valid', value };
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function donationRemittance(donorName: string): string {
  const name = cleanText(donorName);
  return name ? `Don ${name}` : 'Don';
}

export interface EpcTransfer {
  name: string;
  iban: string;
  bic?: string;
  amount?: number;
  remittance?: string;
}

/** Contenu du QR code EPC069-12, version 002, encodage UTF-8. */
export function buildEpcPayload(t: EpcTransfer): string {
  return [
    'BCD',
    '002',
    '1',
    'SCT',
    t.bic ? t.bic.trim() : '',
    t.name.slice(0, 70),
    normalizeIban(t.iban),
    t.amount === undefined ? '' : `EUR${t.amount.toFixed(2)}`,
    '', // motif
    '', // référence structurée
    cleanText(t.remittance ?? '').slice(0, 140),
  ].join('\n');
}
