import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NotFound } from './not-found';

describe('NotFound', () => {
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();
  });

  it('sends visitors back to the home page and the projects', () => {
    const links = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('a'))
      .map(a => a.getAttribute('href'));
    expect(links).toEqual(['/', '/projets']);
  });
});
