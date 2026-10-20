import { Component, DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter, TitleStrategy } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { SeoStrategy } from './seo';

@Component({ template: '' })
class Blank {}

describe('SeoStrategy', () => {
  let harness: RouterTestingHarness;
  let meta: Meta;
  let doc: Document;

  const canonical = () => doc.head.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const tag = (selector: string) => meta.getTag(selector)?.content;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'projets', component: Blank, title: 'Projets', data: { description: 'Les projets' } },
          { path: '**', component: Blank, title: 'Introuvable', data: { noindex: true } },
        ]),
        { provide: TitleStrategy, useClass: SeoStrategy },
      ],
    });
    harness = await RouterTestingHarness.create();
    meta = TestBed.inject(Meta);
    doc = TestBed.inject(DOCUMENT);
  });

  // La page de test Karma est partagée : on retire ce qu'on a ajouté dans <head>
  afterEach(() => {
    ['name="description"', 'name="robots"', 'property="og:title"', 'property="og:description"', 'property="og:url"']
      .forEach(selector => meta.removeTag(selector));
    doc.head.querySelector('link[rel="canonical"]')?.remove();
  });

  it('writes the title, description, share tags and canonical URL of the page', async () => {
    await harness.navigateByUrl('/projets?filtre=sport#liste');

    expect(TestBed.inject(Title).getTitle()).toBe('Projets');
    expect(tag('name="description"')).toBe('Les projets');
    expect(tag('property="og:title"')).toBe('Projets');
    expect(tag('property="og:description"')).toBe('Les projets');
    expect(tag('property="og:url"')).toBe('https://mille-idees.be/projets');
    expect(canonical()).toBe('https://mille-idees.be/projets');
    expect(tag('name="robots"')).toBeUndefined();
  });

  it('marks unknown pages noindex, without canonical URL', async () => {
    await harness.navigateByUrl('/projets');
    await harness.navigateByUrl('/page-qui-existe-pas');

    expect(tag('name="robots"')).toBe('noindex');
    expect(canonical()).toBeUndefined();
    expect(tag('property="og:url"')).toBeUndefined();
  });

  it('makes a page indexable again after a 404', async () => {
    await harness.navigateByUrl('/page-qui-existe-pas');
    await harness.navigateByUrl('/projets');

    expect(tag('name="robots"')).toBeUndefined();
    expect(canonical()).toBe('https://mille-idees.be/projets');
  });
});
