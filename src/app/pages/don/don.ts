import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DONATION } from '../../config/donation';
import { isHttpsUrl, isPlaceholder } from '../../config/values';
import { EpcQr } from './epc-qr';
import { buildEpcPayload, donationRemittance, formatIban, isValidIban, normalizeIban, parseAmount } from './epc';

type CopyStatus = 'idle' | 'done' | 'failed';

const euro = new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' });

@Component({
  selector: 'app-don',
  imports: [EpcQr, RouterLink],
  templateUrl: './don.html',
  styleUrl: './don.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Don {
  protected readonly config = inject(DONATION);

  protected readonly ibanReady = !isPlaceholder(this.config.iban) && isValidIban(this.config.iban);
  protected readonly paymentReady = !isPlaceholder(this.config.paymentLink) && isHttpsUrl(this.config.paymentLink);
  protected readonly bicShown = !isPlaceholder(this.config.bic);
  protected readonly displayIban = formatIban(this.config.iban);

  protected readonly amountRaw = signal('');
  protected readonly donorName = signal('');
  protected readonly copyStatus = signal<CopyStatus>('idle');

  private readonly amount = computed(() => parseAmount(this.amountRaw()));
  protected readonly amountInvalid = computed(() => this.amount().kind === 'invalid');

  protected readonly amountText = computed(() => {
    const a = this.amount();
    return a.kind === 'valid' ? euro.format(a.value) : 'libre';
  });
  protected readonly remittance = computed(() => donationRemittance(this.donorName()));

  protected readonly payload = computed(() => {
    const a = this.amount();
    return buildEpcPayload({
      name: this.config.holder,
      iban: this.config.iban,
      bic: this.bicShown ? this.config.bic : undefined,
      amount: a.kind === 'valid' ? a.value : undefined,
      remittance: this.remittance(),
    });
  });

  protected readonly qrLabel = computed(
    () => `QR code de virement pour ${this.config.holder}. Montant : ${this.amountText()}. Communication : ${this.remittance()}.`,
  );

  protected readonly copyMessage = computed(() => {
    switch (this.copyStatus()) {
      case 'done': return 'IBAN copié';
      case 'failed': return "Copie impossible : sélectionne l'IBAN à la main";
      default: return '';
    }
  });

  protected onAmount(event: Event): void {
    this.amountRaw.set((event.target as HTMLInputElement).value);
  }

  protected onName(event: Event): void {
    this.donorName.set((event.target as HTMLInputElement).value);
  }

  // Le presse-papiers n'est touché qu'au clic : le prérendu n'a pas de navigator
  protected async copyIban(): Promise<void> {
    try {
      await navigator.clipboard.writeText(normalizeIban(this.config.iban));
      this.copyStatus.set('done');
    } catch {
      this.copyStatus.set('failed');
    }
  }
}
