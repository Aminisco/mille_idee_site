import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

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

  it('shows six projects, with a sticker on each photo row', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.project').length).toBe(6);
    expect(el.querySelectorAll('.project--photo').length).toBe(3);
    expect(el.querySelectorAll('.project--photo .sticker').length).toBe(3);
  });

  it('crops the panorama into four terrains for mobile', () => {
    const crops = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.terrain-crop');
    expect(crops.length).toBe(4);
    expect(crops[3].style.getPropertyValue('--i')).toBe('3');
  });
});
