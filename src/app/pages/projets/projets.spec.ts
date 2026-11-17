import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { PROJECTS } from '../../data/projects';
import { ProjectsComponent } from './projets';

// Les attentes viennent des données : changer une date ou un titre ne casse pas la suite
const byDateDesc = [...PROJECTS].sort((a, b) => b.date.localeCompare(a.date));
const PROJECT_ITEMS = byDateDesc.filter(p => p.type === 'projet');
const WORKSHOP_ITEMS = byDateDesc.filter(p => p.type === 'atelier');

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

  const dates = (rows: NodeListOf<Element>) =>
    Array.from(rows).map(row => row.querySelector('time')!.getAttribute('datetime')!);

  it('lists every project, most recent first, without any workshop', () => {
    const titles = Array.from(el.querySelectorAll('ul.project-list:not(.project-list--workshops) .project h2')).map(h => h.textContent?.trim());
    expect(titles.length).toBe(PROJECT_ITEMS.length);
    const shown = dates(projectRows());
    expect(shown.every((d, i) => i === 0 || d <= shown[i - 1])).withContext(shown.join(' ')).toBeTrue();
    for (const workshop of WORKSHOP_ITEMS) {
      expect(titles).not.toContain(workshop.title);
    }
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
    expect(titles()).toEqual(WORKSHOP_ITEMS.map(w => w.title));
    const shown = dates(workshopRows());
    expect(shown.every((d, i) => i === 0 || d <= shown[i - 1])).withContext(shown.join(' ')).toBeTrue();

    filterButton('Sport').click();
    fixture.detectChanges();
    expect(workshopRows().length).toBe(2);
  });

  it('uses a large drawing for the project without a photo', () => {
    const index = PROJECT_ITEMS.findIndex(p => !p.photo);
    expect(index).toBeGreaterThanOrEqual(0);
    const row = projectRows()[index];
    expect(row.querySelector('.doodle')).not.toBeNull();
    expect(row.querySelector('.sticker')).toBeNull();
  });

  it('puts one decorative object next to the first sport and citizen projects only', () => {
    const decors = Array.from(el.querySelectorAll<HTMLImageElement>('.project .decor'));
    const expected = [PROJECT_ITEMS.find(p => p.tag === 'sport')!, PROJECT_ITEMS.find(p => p.tag === 'citoyen')!]
      .sort((x, y) => PROJECT_ITEMS.indexOf(x) - PROJECT_ITEMS.indexOf(y))
      .map(p => p.title);
    expect(decors.map(d => d.closest('.project')?.querySelector('h2')?.textContent?.trim())).toEqual(expected);
    expect(decors.every(d => d.getAttribute('aria-hidden') === 'true' && d.alt === '')).toBeTrue();
  });
});
