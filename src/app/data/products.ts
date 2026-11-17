export interface Product {
  slug: string;
  name: string;
  /** Prix en euros, null tant qu'il n'est pas décidé. */
  price: number | null;
  photo: { src: string; alt: string } | null;
  /** Lien de paiement en https (Mollie, Stripe Payment Link...). Absent tant qu'il n'existe pas. */
  paymentLink?: string;
}

// TODO noms, prix, photos et liens de paiement à fournir par l'asbl : rien n'est inventé ici
export const PRODUCTS: Product[] = [
  {
    slug: 'bic-1',
    name: 'TODO nom du bic 1',
    price: null,
    photo: null,
    // paymentLink: 'TODO lien de paiement en https',
  },
  {
    slug: 'bic-2',
    name: 'TODO nom du bic 2',
    price: null,
    photo: null,
    // paymentLink: 'TODO lien de paiement en https',
  },
  {
    slug: 'bic-3',
    name: 'TODO nom du bic 3',
    price: null,
    photo: null,
    // paymentLink: 'TODO lien de paiement en https',
  },
];

const euro = new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' });

export function formatPrice(price: number | null): string {
  return price === null ? 'Prix à venir' : euro.format(price);
}
