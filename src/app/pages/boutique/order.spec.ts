import { encodeOrder, ORDER_FIELDS, ORDER_FORM_NAME, OrderPayload, submitOrder } from './order';

const order: OrderPayload = {
  produit: 'TODO nom du bic 1',
  nom: 'Sarah',
  email: 'sarah@example.com',
  quantite: 2,
  remarque: 'Bleu & rouge',
  'bot-field': '',
};

describe('order', () => {
  it('encodes the order as url-encoded form data with the form name first', () => {
    expect(encodeOrder(order)).toBe(
      'form-name=commande&produit=TODO+nom+du+bic+1&nom=Sarah&email=sarah%40example.com&quantite=2&remarque=Bleu+%26+rouge&bot-field=',
    );
    expect(ORDER_FORM_NAME).toBe('commande');
  });

  it('posts the encoded order to /', async () => {
    const fetchFn = jasmine.createSpy('fetch').and.resolveTo({ ok: true, status: 200 } as Response);
    await submitOrder(order, fetchFn as unknown as typeof fetch);
    expect(fetchFn).toHaveBeenCalledOnceWith('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeOrder(order),
      signal: jasmine.any(AbortSignal),
    });
  });

  it('rejects when the response is not ok', async () => {
    const fetchFn = jasmine.createSpy('fetch').and.resolveTo({ ok: false, status: 500 } as Response);
    await expectAsync(submitOrder(order, fetchFn as unknown as typeof fetch)).toBeRejected();
  });

  it('rejects when the request times out or is aborted', async () => {
    for (const name of ['TimeoutError', 'AbortError']) {
      const fetchFn = jasmine.createSpy('fetch').and.rejectWith(new DOMException('too slow', name));
      await expectAsync(submitOrder(order, fetchFn as unknown as typeof fetch)).toBeRejected();
    }
  });

  it('aborts a request that never answers', async () => {
    const fetchFn = jasmine.createSpy('fetch').and.callFake(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => init.signal!.addEventListener('abort', () => reject(init.signal!.reason))),
    );
    const timeoutSpy = spyOn(AbortSignal, 'timeout').and.callFake(() => {
      const c = new AbortController();
      setTimeout(() => c.abort(new DOMException('too slow', 'TimeoutError')), 10);
      return c.signal;
    });
    await expectAsync(submitOrder(order, fetchFn as unknown as typeof fetch)).toBeRejectedWithError(/too slow/);
    expect(timeoutSpy).toHaveBeenCalledWith(15000);
  });

  it('declares the same fields in __forms.html and in the posted body', async () => {
    const html = await (await fetch('/__forms.html')).text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const form = doc.querySelector('form[name="commande"]')!;
    expect(form.hasAttribute('netlify')).toBeTrue();
    expect(form.getAttribute('netlify-honeypot')).toBe('bot-field');
    expect([...form.querySelectorAll('[name]')].map(e => e.getAttribute('name')).sort()).toEqual([...ORDER_FIELDS].sort());
    const posted = [...new URLSearchParams(encodeOrder(order)).keys()].filter(k => k !== 'form-name');
    expect(posted.sort()).toEqual([...ORDER_FIELDS].sort());
  });
});
