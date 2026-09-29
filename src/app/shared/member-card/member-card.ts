import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface Member {
  name: string;
  role: string;
  bio: string;
  /** Sans photo, on affiche les initiales dans un cercle jaune */
  photo?: string;
}

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.html',
  styleUrl: './member-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberCard {
  readonly member = input.required<Member>();
  readonly ring = input<'yellow' | 'red'>('yellow');

  protected readonly initials = computed(() =>
    this.member().name
      .split(' ')
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join(''),
  );

  protected readonly ringSrc = computed(() =>
    this.ring() === 'red' ? 'illustrations/ring_red.svg' : 'illustrations/ring_yel.svg',
  );
}
