import { InjectionToken } from '@angular/core';

export interface DonationConfig {
  holder: string;
  iban: string;
  bic: string;
  paymentLink: string;
  reference: string;
}

export const DONATION_CONFIG: DonationConfig = {
  holder: 'ASBL Mille Idées',
  iban: 'BE94 3632 8315 0114', // IBAN du compte de l'asbl, espaces acceptés
  bic: 'TODO_BIC',
  paymentLink: 'TODO_PAYMENT_LINK', // lien Mollie ou Stripe Payment Link, en https
  reference: 'Don + ton nom',
};

export const DONATION = new InjectionToken<DonationConfig>('DONATION', {
  factory: () => DONATION_CONFIG,
});
