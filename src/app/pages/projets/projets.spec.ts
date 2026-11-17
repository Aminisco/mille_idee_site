import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { ProjectsComponent } from './projets';

describe('ProjectsComponent', () => {
  let fixture: ComponentFixture<ProjectsComponent>;
  let el: HTMLElement;

  const filterButton = (label: string) =>
    Array.from(el.querySelectorAll<HTMLButtonElement>('.filter')).find(b => b.textContent?.trim().startsWith(label))!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  const projectRows = () => el.querySelectorAll('ul.project-list:not(.project-list--workshops) .project');
  const workshopRows = () => el.querySelectorAll('#ateliers li');

  it('lists the ten projects, most recent first, without any workshop', () => {
    const titles = Array.from(el.querySelectorAll('ul.project-list:not(.project-list--workshops) .project h2')).map(h => h.textContent?.trim());
    expect(titles.length).toBe(10);
    expect(titles[9]).toBe('Première maraude');
    expect(titles).not.toContain("Ateliers d'écriture");
    expect(titles).not.toContain("Atelier d'écriture : projet Canada");
  });

  it('shows a count on each filter', () => {
    expect(filterButton('Tous').textContent).toContain('10');
    expect(filterButton('Maraude').textContent).toContain('3');
    expect(filterButton('Financement').textContent).toContain('2');
    expect(filterButton('Sport').textContent).toContain('3');
    expect(filterButton('Citoyen').textContent).toContain('2');
  });

  it('filters the list and marks the active filter', () => {
    filterButton('Maraude').click();
    fixture.detectChanges();

    expect(projectRows().length).toBe(3);
    expect(filterButton('Maraude').getAttribute('aria-pressed')).toBe('true');
    expect(filterButton('Tous').getAttribute('aria-pressed')).toBe('false');
    expect(el.querySelector('[aria-live]')?.textContent).toContain('3 projets affichés');
  });

  it('has a workshops section with a title and two workshops, unaffected by filters', () => {
    const section = el.querySelector('#ateliers')!;
    expect(section.querySelector('h2')?.textContent?.trim()).toBe('Nos ateliers');
    const titles = () => Array.from(workshopRows()).map(li => li.querySelector('h3')?.textContent?.trim());
    expect(titles()).toEqual(["Ateliers d'écriture", "Atelier d'écriture : projet Canada"]);

    filterButton('Sport').click();
    fixture.detectChanges();
    expect(workshopRows().length).toBe(2);
  });

  it('uses a large drawing for the project without a photo', () => {
    const last = projectRows()[9];
    expect(last.querySelector('.doodle')).not.toBeNull();
    expect(last.querySelector('.sticker')).toBeNull();
  });

  it('puts one decorative object next to the first sport and citizen projects only', () => {
    const decors = Array.from(el.querySelectorAll<HTMLImageElement>('.project .decor'));
    expect(decors.map(d => d.closest('.project')?.querySelector('h2')?.textContent?.trim())).toEqual([
      'Basket',
      'Visite historique de Bruxelles',
    ]);
    expect(decors.every(d => d.getAttribute('aria-hidden') === 'true' && d.alt === '')).toBeTrue();
  });
});
