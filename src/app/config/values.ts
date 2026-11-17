/** Vrai si la valeur est vide, blanche ou un marqueur TODO à remplir. */
export function isPlaceholder(value: string | undefined): boolean {
  const v = (value ?? '').trim();
  return v === '' || v.startsWith('TODO');
}

/** Vrai si la valeur est une URL en https. */
export function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}
