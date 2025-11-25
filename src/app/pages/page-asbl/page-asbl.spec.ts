import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAsbl } from './page-asbl';

describe('PageAsbl', () => {
  let component: PageAsbl;
  let fixture: ComponentFixture<PageAsbl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAsbl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageAsbl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
