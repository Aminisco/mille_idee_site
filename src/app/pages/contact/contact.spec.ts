import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contact } from './contact';

describe('Contact', () => {
  let component: Contact;
  let fixture: ComponentFixture<Contact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows every error and marks the fields invalid when the empty form is submitted', () => {
    const el = fixture.nativeElement as HTMLElement;
    const submit = el.querySelector<HTMLButtonElement>('button[type=submit]')!;

    expect(submit.disabled).toBeFalse();
    submit.click();
    fixture.detectChanges();

    expect(el.querySelectorAll('.error').length).toBe(4);
    expect(el.querySelectorAll('[aria-invalid="true"]').length).toBe(4);
    expect(el.querySelector('#email')?.getAttribute('aria-describedby')).toBe('email-error');
    expect(component.isSending).toBeFalse();
  });
});
