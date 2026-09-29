import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Bandeau encre avec les jeunes qui dépassent du bord et le mégaphone.
 * La position du mégaphone se règle avec --megaphone-right sur l'hôte.
 */
@Component({
  selector: 'app-ink-band',
  template: `
    <img class="peek" src="illustrations/peek.svg" alt="" width="620" height="130" loading="lazy">
    <img class="megaphone" src="illustrations/megaphone.svg" alt="" width="200" height="167" loading="lazy">
    <ng-content />
  `,
  styleUrl: './ink-band.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'on-ink' },
})
export class InkBand {}
