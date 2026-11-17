import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { DONATION, DONATION_CONFIG, DonationConfig } from '../../config/donation';
import { Don } from './don';
import { EpcQr } from './epc-qr';

const VALID: DonationConfig = {
  holder: 'ASBL Mille Idées',
  iban: 'BE68 5390 0754 7034',
  bic: 'GEBABEBB',
  paymentLink: 'https://example.com/pay',
  reference: 'Don + ton nom',
};

describe('Don', () => {
  let fixture: ComponentFixture<Don>;
  let el: HTMLElement;

  const setup = async (config: DonationConfig) => {
    await TestBed.configureTestingModule({
      imports: [Don],
      providers: [provideRouter([]), { provide: DONATION, useValue: config }],
    }).compileComponents();
    fixture = TestBed.createComponent(Don);
    fixture.detectChanges();
    el = fixture.nativeElement;
  };

  const text = () => (el.textContent ?? '').replace(/\s/g, ' ');
  const input = (label: string) =>
    Array.from(el.querySelectorAll<HTMLLabelElement>('label'))
      .find(l => l.textContent?.includes(label))!
      .control as HTMLInputElement;
  const type = (label: string, value: string) => {
    const i = input(label);
    i.value = value;
    i.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  const caption = () => (el.querySelector('.qr-caption')?.textContent ?? '').replace(/\s+/g, ' ');
  const qrPayload = () => fixture.debugElement.query(By.directive(EpcQr)).componentInstance.payload() as string;
  const copyButton = () =>
    Array.from(el.querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent?.includes("Copier l'IBAN"));

  describe('with a valid config', () => {
    beforeEach(() => setup(VALID));

    it('shows the transfer details, the QR code and the payment link', () => {
      expect(text()).toContain('ASBL Mille Idées');
      expect(text()).toContain('BE68 5390 0754 7034');
      expect(text()).toContain('GEBABEBB');
      expect(text()).toContain('Don + ton nom');
      expect(el.querySelector('app-epc-qr')).not.toBeNull();
      const link = Array.from(el.querySelectorAll('a')).find(a => a.textContent?.includes('Payer par Bancontact ou carte'))!;
      expect(link.getAttribute('href')).toBe('https://example.com/pay');
    });

    it('has a single h1', () => {
      expect(el.querySelectorAll('h1').length).toBe(1);
    });

    it('reflects a valid amount in the QR caption', () => {
      type('Montant (facultatif)', '12,50');
      expect(caption()).toContain('Montant : 12,50 €');
    });

    it('flags an invalid amount, links the message to the field and falls back to a free amount', () => {
      type('Montant (facultatif)', 'abc');
      const field = input('Montant (facultatif)');
      const msg = el.querySelector('#amount-error')!;
      expect(msg.textContent).toContain('Montant invalide : écris par exemple 20 ou 12,50');
      expect(field.getAttribute('aria-describedby')).toContain('amount-error');
      expect(field.getAttribute('aria-invalid')).toBe('true');
      expect(caption()).toContain('Montant : libre');
    });

    it('does not flag a trailing separator while the donor is still typing', () => {
      type('Montant (facultatif)', '12,');
      const field = input('Montant (facultatif)');
      expect(el.querySelector('#amount-error')).toBeNull();
      expect(field.getAttribute('aria-invalid')).toBeNull();
      expect(caption()).toContain('Montant : libre');
      expect(qrPayload().split('\n')[7]).toBe('');
      type('Montant (facultatif)', '12,5');
      expect(caption()).toContain('Montant : 12,50 €');
    });

    it('still flags a really invalid amount after a separator', () => {
      type('Montant (facultatif)', '12,,');
      expect(el.querySelector('#amount-error')).not.toBeNull();
    });

    it('encodes the configured IBAN, the typed amount and the donor name in the QR payload', () => {
      type('Montant (facultatif)', '12,50');
      type('Ton nom (facultatif)', 'Sarah');
      expect(qrPayload()).toBe('BCD\n002\n1\nSCT\nGEBABEBB\nASBL Mille Idées\nBE68539007547034\nEUR12.50\n\n\nDon Sarah');
    });

    it('puts the donor name in the remittance caption', () => {
      type('Ton nom (facultatif)', 'Sarah');
      expect(caption()).toContain('Communication : Don Sarah');
    });

    it('copies the IBAN and announces it', async () => {
      const writeText = jasmine.createSpy('writeText').and.resolveTo();
      spyOnProperty(navigator, 'clipboard', 'get').and.returnValue({ writeText } as unknown as Clipboard);
      copyButton()!.click();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(writeText).toHaveBeenCalledWith('BE68539007547034');
      expect(el.querySelector('[aria-live="polite"]')!.textContent).toContain('IBAN copié');
    });

    it('announces a copy failure', async () => {
      const writeText = jasmine.createSpy('writeText').and.rejectWith(new Error('denied'));
      spyOnProperty(navigator, 'clipboard', 'get').and.returnValue({ writeText } as unknown as Clipboard);
      copyButton()!.click();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(el.querySelector('[aria-live="polite"]')!.textContent).toContain("Copie impossible : sélectionne l'IBAN à la main");
    });

    it('announces a copy failure when the clipboard is unavailable', () => {
      spyOnProperty(navigator, 'clipboard', 'get').and.returnValue(undefined as unknown as Clipboard);
      copyButton()!.click();
      fixture.detectChanges();
      expect(el.querySelector('[aria-live="polite"]')!.textContent).toContain('Copie impossible');
    });

    it('never mentions tax deductibility', () => {
      expect(text().toLowerCase()).not.toContain('déductible');
    });
  });

  describe('BIC guard', () => {
    it('shows and encodes a lower-case BIC normalised', async () => {
      await setup({ ...VALID, bic: 'gebabebb' });
      expect(text()).toContain('GEBABEBB');
      expect(qrPayload().split('\n')[4]).toBe('GEBABEBB');
    });

    it('neither shows nor encodes a malformed BIC', async () => {
      await setup({ ...VALID, bic: 'GEB@' });
      expect(text()).not.toContain('GEB@');
      expect(el.textContent).not.toContain('BIC');
      expect(qrPayload().split('\n')[4]).toBe('');
    });
  });

  describe('with the default placeholder config', () => {
    beforeEach(() => setup(DONATION_CONFIG));

    it('shows only the coming-soon message with a link to the contact page', () => {
      expect(el.querySelector('app-epc-qr')).toBeNull();
      expect(copyButton()).toBeUndefined();
      expect(text()).not.toContain('TODO_');
      expect(text()).not.toContain('Payer par Bancontact');
      expect(text()).toContain('Les coordonnées bancaires arrivent bientôt. En attendant, écris-nous depuis la page Contact.');
      expect(el.querySelector('a[href="/contact"]')).not.toBeNull();
    });

    it('never mentions tax deductibility', () => {
      expect(text().toLowerCase()).not.toContain('déductible');
    });
  });

  describe('with a valid IBAN but no payment link', () => {
    beforeEach(() => setup({ ...VALID, paymentLink: 'TODO_PAYMENT_LINK' }));

    it('shows the transfer part only', () => {
      expect(el.querySelector('app-epc-qr')).not.toBeNull();
      expect(text()).not.toContain('Payer par Bancontact');
      expect(text()).not.toContain('Par Bancontact ou carte');
      expect(text()).not.toContain('arrivent bientôt');
    });
  });
});
