import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has a "Le site" column with the internal links in order', () => {
    const el = fixture.nativeElement as HTMLElement;
    const title = Array.from(el.querySelectorAll('h2')).find(h => h.textContent?.trim() === 'Le site')!;
    expect(title).toBeTruthy();
    const links = Array.from(title.parentElement!.querySelectorAll<HTMLAnchorElement>('a'));
    expect(links.map(a => a.textContent?.trim())).toEqual(
      ['Projets', 'Ateliers', "L'asbl", 'Boutique', 'Faire un don', 'Contact']);
    expect(links.map(a => a.getAttribute('href'))).toEqual(
      ['/projets', '/projets#ateliers', '/asbl', '/boutique', '/don', '/contact']);
  });
});
