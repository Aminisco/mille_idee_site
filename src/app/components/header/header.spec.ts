import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lists the main nav links in order, with donate as the only button', () => {
    const el = fixture.nativeElement as HTMLElement;
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('nav.nav a'));
    expect(links.map(a => a.textContent?.trim())).toEqual(
      ['Projets', "L'asbl", 'Boutique', 'Contact', 'Faire un don']);
    expect(links.map(a => a.getAttribute('href'))).toEqual(
      ['/projets', '/asbl', '/boutique', '/contact', '/don']);
    expect(links.map(a => a.classList.contains('btn'))).toEqual(
      [false, false, false, false, true]);
  });

  it('lists the drawer links in order', () => {
    const el = fixture.nativeElement as HTMLElement;
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('#mobile-nav a'));
    expect(links.map(a => a.textContent?.trim())).toEqual(
      ['Accueil', 'Projets', "L'asbl", 'Boutique', 'Contact', 'Faire un don']);
    expect(links.map(a => a.getAttribute('href'))).toEqual(
      ['/', '/projets', '/asbl', '/boutique', '/contact', '/don']);
  });

  it('opens the drawer and closes it on Escape', () => {
    const el = fixture.nativeElement as HTMLElement;
    const toggle = el.querySelector<HTMLButtonElement>('.menu-toggle')!;
    const drawer = el.querySelector('#mobile-nav')!;

    expect(drawer.hasAttribute('inert')).toBeTrue();

    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(drawer.hasAttribute('inert')).toBeFalse();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(component.menuOpen()).toBeFalse();
    expect(drawer.hasAttribute('inert')).toBeTrue();
  });
});
