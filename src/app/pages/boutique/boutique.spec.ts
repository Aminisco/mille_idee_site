import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Product } from '../../data/products';
import { Boutique, ORDER_SUBMITTER, SHOP_PRODUCTS } from './boutique';
import { OrderPayload } from './order';

const PRODUCTS_FIXTURE: Product[] = [
  { slug: 'bic-1', name: 'TODO nom du bic 1', price: null, photo: null },
  { slug: 'bic-2', name: 'TODO nom du bic 2', price: null, photo: null, paymentLink: 'https://pay.example.com/bic-2' },
  { slug: 'bic-3', name: 'TODO nom du bic 3', price: null, photo: null },
];

describe('Boutique', () => {
  let fixture: ComponentFixture<Boutique>;
  let el: HTMLElement;
  let submit: jasmine.Spy<(order: OrderPayload) => Promise<void>>;

  async function setup(products: Product[] = PRODUCTS_FIXTURE): Promise<void> {
    submit = jasmine.createSpy('submitOrder').and.resolveTo();
    await TestBed.configureTestingModule({
      imports: [Boutique],
      providers: [
        provideRouter([]),
        { provide: SHOP_PRODUCTS, useValue: products },
        { provide: ORDER_SUBMITTER, useValue: submit },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(Boutique);
    el = fixture.nativeElement;
    fixture.detectChanges();
  }

  const orderButtons = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.product button'));
  const dialog = () => el.querySelector('dialog')!;
  const input = (name: string) => el.querySelector<HTMLInputElement | HTMLTextAreaElement>(`dialog [name="${name}"]`)!;
  const submitBtn = () => el.querySelector<HTMLButtonElement>('dialog button[type=submit]')!;

  function fill(): void {
    for (const [name, value] of [['nom', 'Sarah'], ['email', 'sarah@example.com'], ['quantite', '2'], ['remarque', 'Bleu']]) {
      const field = input(name);
      field.value = value;
      field.dispatchEvent(new Event('input'));
    }
    fixture.detectChanges();
  }

  afterEach(() => {
    if (el && dialog()?.open) {
      dialog().close();
    }
  });

  it('lists three products with name, price and an order button', async () => {
    await setup();
    const items = el.querySelectorAll('.product');
    expect(items.length).toBe(3);
    expect(items[0].querySelector('h2')?.textContent).toContain('TODO nom du bic 1');
    expect(items[0].textContent).toContain('Prix à venir');
    expect(orderButtons().map(b => b.textContent?.trim())).toEqual(['Commander', 'Commander', 'Commander']);
  });

  it('opens a labelled dialog titled with the product name', async () => {
    await setup();
    orderButtons()[0].click();
    fixture.detectChanges();
    expect(dialog().open).toBeTrue();
    const title = el.querySelector('dialog h2')!;
    expect(title.textContent).toContain('TODO nom du bic 1');
    expect(dialog().getAttribute('aria-labelledby')).toBe(title.id);
    const visible = Array.from(el.querySelectorAll<HTMLInputElement>('dialog input, dialog textarea')).filter(i => i.name !== 'bot-field');
    expect(visible.length).toBe(4);
    for (const field of visible) {
      expect(el.querySelector(`dialog label[for="${field.id}"]`)).withContext(field.name).not.toBeNull();
    }
  });

  it('shows linked errors and makes no request when sent empty', async () => {
    await setup();
    orderButtons()[0].click();
    fixture.detectChanges();
    input('quantite').value = '';
    input('quantite').dispatchEvent(new Event('input'));
    submitBtn().click();
    fixture.detectChanges();
    for (const name of ['nom', 'email', 'quantite']) {
      const field = input(name);
      expect(field.getAttribute('aria-invalid')).withContext(name).toBe('true');
      const errorId = field.getAttribute('aria-describedby')!;
      expect(el.querySelector(`#${errorId}`)?.textContent?.trim()).withContext(name).not.toBe('');
    }
    expect(submit).not.toHaveBeenCalled();
  });

  it('sends only once after two quick clicks, disables the button, then thanks', async () => {
    await setup();
    let resolve!: () => void;
    submit.and.returnValue(new Promise<void>(r => (resolve = r)));
    orderButtons()[0].click();
    fixture.detectChanges();
    fill();
    submitBtn().click();
    submitBtn().click();
    fixture.detectChanges();
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit.calls.mostRecent().args[0]).toEqual({
      produit: 'TODO nom du bic 1', nom: 'Sarah', email: 'sarah@example.com', quantite: 2, remarque: 'Bleu', 'bot-field': '',
    });
    expect(submitBtn().disabled).toBeTrue();
    resolve();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(dialog().textContent).toContain('Merci ! On a bien reçu ta commande, on te répond par mail.');
  });

  it('shows a "Payer en ligne" link after success only when the product has a valid payment link', async () => {
    await setup();
    orderButtons()[1].click();
    fixture.detectChanges();
    fill();
    submitBtn().click();
    await fixture.whenStable();
    fixture.detectChanges();
    const link = Array.from(el.querySelectorAll<HTMLAnchorElement>('dialog a')).find(a => a.textContent?.includes('Payer en ligne'));
    expect(link?.getAttribute('href')).toBe('https://pay.example.com/bic-2');
    dialog().close();

    orderButtons()[0].click();
    fixture.detectChanges();
    fill();
    submitBtn().click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(dialog().textContent).toContain('Merci !');
    expect(dialog().textContent).not.toContain('Payer en ligne');
  });

  it('ignores a payment link that is not https', async () => {
    await setup([{ slug: 'x', name: 'X', price: null, photo: null, paymentLink: 'http://pay.example.com' }]);
    orderButtons()[0].click();
    fixture.detectChanges();
    fill();
    submitBtn().click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(dialog().textContent).not.toContain('Payer en ligne');
  });

  it('shows an error and keeps the values when sending fails', async () => {
    await setup();
    submit.and.rejectWith(new Error('500'));
    orderButtons()[0].click();
    fixture.detectChanges();
    fill();
    submitBtn().click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(dialog().textContent).toContain("L'envoi n'a pas marché. Réessaie, ou écris-nous depuis la page Contact.");
    expect(input('nom').value).toBe('Sarah');
    expect(input('email').value).toBe('sarah@example.com');
    expect(submitBtn().disabled).toBeFalse();
  });

  it('shows the privacy line under the form', async () => {
    await setup();
    expect(dialog().textContent).toContain('Ton nom et ton email servent uniquement à traiter ta commande. Ils passent par Netlify, notre hébergeur.');
  });

  it('resets the form on each opening and returns focus to the opening button on close', async () => {
    await setup();
    const button = orderButtons()[0];
    button.focus();
    button.click();
    fixture.detectChanges();
    fill();
    el.querySelector<HTMLButtonElement>('dialog button[type=button]')!.click();
    fixture.detectChanges();
    expect(dialog().open).toBeFalse();
    await new Promise(r => setTimeout(r));
    expect(document.activeElement).toBe(button);

    button.click();
    fixture.detectChanges();
    expect(input('nom').value).toBe('');
    expect(input('quantite').value).toBe('1');
  });

  it('moves focus to the thank-you message after success', async () => {
    await setup();
    orderButtons()[0].click();
    fixture.detectChanges();
    fill();
    submitBtn().click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(document.activeElement?.id).toBe('order-success');
  });

  it('focuses the name field when reopened after a successful order', async () => {
    await setup();
    orderButtons()[0].click();
    fixture.detectChanges();
    fill();
    submitBtn().click();
    await fixture.whenStable();
    fixture.detectChanges();
    dialog().close();

    orderButtons()[1].click();
    fixture.detectChanges();
    expect(document.activeElement?.id).toBe('order-nom');
    expect(input('nom').value).toBe('');
  });

  it('ignores a late result and blocks a second send after the dialog was closed during sending', async () => {
    await setup();
    let resolve!: () => void;
    submit.and.returnValue(new Promise<void>(r => (resolve = r)));
    orderButtons()[0].click();
    fixture.detectChanges();
    fill();
    submitBtn().click();
    fixture.detectChanges();
    dialog().close();

    orderButtons()[1].click();
    fixture.detectChanges();
    fill();
    submitBtn().click();
    fixture.detectChanges();
    expect(submit).toHaveBeenCalledTimes(1);

    resolve();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(dialog().textContent).not.toContain('Merci !');
    expect(dialog().textContent).toContain('Commander : TODO nom du bic 2');
    expect(submitBtn().disabled).toBeFalse();
  });
});
