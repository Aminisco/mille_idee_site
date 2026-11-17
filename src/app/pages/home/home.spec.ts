import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PROJECTS } from '../../data/projects';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('says twelve projects, in letters', () => {
    // Le compteur est écrit en toutes lettres dans home.html : le mettre à jour si ce nombre change
    expect(PROJECTS.length).toBe(12);
    const head = (fixture.nativeElement as HTMLElement).querySelector('.projects .section-head');
    expect(head?.textContent).toContain('Douze projets');
  });

  it('shows the SRG speciality in the hero', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector('.hero .speciality');
    expect(el?.textContent?.trim()).toBe('Spécialisation SRG / Aide à la Jeunesse');
  });

  it('shows six projects, each with its photo and a sticker', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.project').length).toBe(6);
    expect(el.querySelectorAll('.project--photo').length).toBe(6);
    expect(el.querySelectorAll('.project--photo .sticker').length).toBe(6);
    expect(el.querySelectorAll('.project-doodle').length).toBe(0);
  });

  it('crops the panorama into four terrains for mobile', () => {
    const crops = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.terrain-crop');
    expect(crops.length).toBe(4);
    expect(crops[3].style.getPropertyValue('--i')).toBe('3');
  });
});
