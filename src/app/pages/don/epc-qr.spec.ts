import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpcQr } from './epc-qr';

describe('EpcQr', () => {
  let fixture: ComponentFixture<EpcQr>;

  const render = (payload: string, label = 'QR code de virement') => {
    fixture.componentRef.setInput('payload', payload);
    fixture.componentRef.setInput('label', label);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EpcQr] }).compileComponents();
    fixture = TestBed.createComponent(EpcQr);
  });

  it('renders an accessible square svg with a white background and a module path', () => {
    const el = render('BCD\n002\n1\nSCT', 'QR code de virement de 12,50 €');
    const svg = el.querySelector('svg')!;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('QR code de virement de 12,50 €');
    const [, , w, h] = svg.getAttribute('viewBox')!.split(' ').map(Number);
    expect(w).toBeGreaterThan(0);
    expect(w).toBe(h);
    const bg = svg.querySelector('rect')!;
    expect(bg.getAttribute('fill')?.toLowerCase()).toBe('#fff');
    expect(svg.querySelector('path')!.getAttribute('d')!.length).toBeGreaterThan(0);
  });

  it('draws a different path for a different payload', () => {
    const a = render('BCD\n002\n1\nSCT\nA').querySelector('path')!.getAttribute('d');
    fixture.componentRef.setInput('payload', 'BCD\n002\n1\nSCT\nB-another-one');
    fixture.detectChanges();
    const b = (fixture.nativeElement as HTMLElement).querySelector('path')!.getAttribute('d');
    expect(a).not.toEqual(b);
  });
});
