export const ORDER_FORM_NAME = 'commande';

// Doit rester identique aux champs de public/__forms.html (Netlify détecte le formulaire dans ce fichier)
export const ORDER_FIELDS = ['produit', 'nom', 'email', 'quantite', 'remarque', 'bot-field'] as const;

export interface OrderPayload {
  produit: string;
  nom: string;
  email: string;
  quantite: number;
  remarque: string;
  'bot-field': string;
}

export function encodeOrder(order: OrderPayload): string {
  const params = new URLSearchParams({ 'form-name': ORDER_FORM_NAME });
  for (const field of ORDER_FIELDS) {
    params.append(field, String(order[field]));
  }
  return params.toString();
}

const ORDER_TIMEOUT_MS = 15000;

// Netlify Forms reçoit le POST sur « / » (adresse terminée par un slash : pas de 301 qui perdrait le corps)
export async function submitOrder(order: OrderPayload, fetchFn: typeof fetch = fetch): Promise<void> {
  const res = await fetchFn('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeOrder(order),
    // Une requête qui ne répond jamais finit en erreur au lieu de garder le verrou d'envoi
    signal: AbortSignal.timeout(ORDER_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Order submission failed: ${res.status}`);
  }
}
