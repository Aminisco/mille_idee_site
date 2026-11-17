import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { encode } from 'uqr';

/** QR code EPC : niveau de correction M imposé par la norme, zone de silence de 4 modules incluse. */
@Component({
  selector: 'app-epc-qr',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      role="img"
      [attr.aria-label]="label()"
      [attr.viewBox]="'0 0 ' + qr().size + ' ' + qr().size"
      shape-rendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#fff" />
      <path [attr.d]="qr().path" fill="var(--ink)" />
    </svg>
  `,
  styles: `
    :host { display: block; width: 220px; max-width: 100%; }
    svg { display: block; width: 100%; height: auto; border: var(--border); }
  `,
})
export class EpcQr {
  readonly payload = input.required<string>();
  readonly label = input.required<string>();

  protected readonly qr = computed(() => {
    const { data, size } = encode(this.payload(), { ecc: 'M', border: 4 });
    let path = '';
    data.forEach((row, y) => row.forEach((dark, x) => {
      if (dark) {
        path += `M${x} ${y}h1v1h-1z`;
      }
    }));
    return { size, path };
  });
}
