import { routes } from './app.routes';

describe('routes', () => {
  const indexable = routes.filter(r => r.component && !r.data?.['noindex']);

  it('gives every indexable route a title and a description of 160 characters max', () => {
    expect(indexable.length).toBeGreaterThan(0);
    for (const r of indexable) {
      expect(typeof r.title).withContext(`title of "${r.path}"`).toBe('string');
      const description = r.data?.['description'] as string | undefined;
      expect(description).withContext(`description of "${r.path}"`).toBeTruthy();
      expect(description!.length).withContext(`description length of "${r.path}"`).toBeLessThanOrEqual(160);
    }
  });

  it('lists every indexable route in the sitemap', async () => {
    const response = await fetch('/sitemap.xml');
    expect(response.ok).withContext('sitemap.xml must be served by Karma').toBeTrue();
    const xml = await response.text();
    for (const r of indexable) {
      const url = r.path ? `https://mille-idees.be/${r.path}` : 'https://mille-idees.be/';
      expect(xml).withContext(`sitemap entry for "${r.path}"`).toContain(`<loc>${url}</loc>`);
    }
  });
});
