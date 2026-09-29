import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Edge } from './edge';

describe('Edge', () => {
  let fixture: ComponentFixture<Edge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Edge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Edge);
  });

  it('closes the fill path under the stroke', () => {
    fixture.componentRef.setInput('shape', 'cloud');
    fixture.detectChanges();

    const [fill, stroke] = fixture.nativeElement.querySelectorAll('path');
    expect(fill.getAttribute('d')).toContain(stroke.getAttribute('d'));
    expect(fill.getAttribute('d')).toMatch(/Z$/);
  });

  it('exposes the tone as a host class', () => {
    fixture.componentRef.setInput('tone', 'accent');
    fixture.detectChanges();

    expect(fixture.nativeElement.classList).toContain('tone-accent');
  });
});
