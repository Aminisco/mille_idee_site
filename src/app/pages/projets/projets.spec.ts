import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsComponent } from './projets';

describe('ProjectsComponent', () => {
  let fixture: ComponentFixture<ProjectsComponent>;
  let el: HTMLElement;

  const filterButton = (label: string) =>
    Array.from(el.querySelectorAll<HTMLButtonElement>('.filter')).find(b => b.textContent?.trim().startsWith(label))!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('lists the seven projects, most recent first', () => {
    const titles = Array.from(el.querySelectorAll('.project h2')).map(h => h.textContent?.trim());
    expect(titles.length).toBe(7);
    expect(titles[0]).toBe('Vente de gaufres');
    expect(titles[6]).toBe('Première maraude');
  });

  it('shows a count on each filter', () => {
    expect(filterButton('Tous').textContent).toContain('7');
    expect(filterButton('Maraude').textContent).toContain('3');
    expect(filterButton('Financement').textContent).toContain('2');
  });

  it('filters the list and marks the active filter', () => {
    filterButton('Maraude').click();
    fixture.detectChanges();

    expect(el.querySelectorAll('.project').length).toBe(3);
    expect(filterButton('Maraude').getAttribute('aria-pressed')).toBe('true');
    expect(filterButton('Tous').getAttribute('aria-pressed')).toBe('false');
    expect(el.querySelector('[aria-live]')?.textContent).toContain('3 projets affichés');
  });

  it('uses a large drawing for the project without a photo', () => {
    const last = el.querySelectorAll('.project')[6];
    expect(last.querySelector('.doodle')).not.toBeNull();
    expect(last.querySelector('.sticker')).toBeNull();
  });
});
