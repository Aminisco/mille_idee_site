import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PageAsbl } from './page-asbl';

describe('PageAsbl', () => {
  let component: PageAsbl;
  let fixture: ComponentFixture<PageAsbl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAsbl],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageAsbl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the five team members, alternating rings, without any email', () => {
    const el = fixture.nativeElement as HTMLElement;
    const rings = Array.from(el.querySelectorAll('app-member-card .ring')).map(r => r.getAttribute('src'));

    expect(el.querySelectorAll('app-member-card').length).toBe(5);
    expect(rings).toEqual([
      'illustrations/ring_yel.svg',
      'illustrations/ring_red.svg',
      'illustrations/ring_yel.svg',
      'illustrations/ring_red.svg',
      'illustrations/ring_yel.svg',
    ]);
    expect(el.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(el.textContent).not.toContain('@');
  });
});
