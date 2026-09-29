import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCard } from './member-card';

describe('MemberCard', () => {
  let fixture: ComponentFixture<MemberCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberCard);
  });

  it('shows the portrait inside the chosen ring', () => {
    fixture.componentRef.setInput('member', { name: 'Julien Dubois', role: 'Président', bio: '', photo: 'assets/equipe/julien.jpg' });
    fixture.componentRef.setInput('ring', 'red');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.ring')?.getAttribute('src')).toContain('ring_red');
    expect(el.querySelector('img.face')?.getAttribute('alt')).toBe('Portrait de Julien Dubois');
  });

  it('falls back to initials without a photo', () => {
    fixture.componentRef.setInput('member', { name: 'Saphae Allaoui', role: 'Communication', bio: '' });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('img.face')).toBeNull();
    expect(el.querySelector('.initials')?.textContent?.trim()).toBe('SA');
  });
});
