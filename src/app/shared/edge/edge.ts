import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type EdgeShape = 'wave' | 'wave-2' | 'cloud' | 'cloud-2';
export type EdgeTone = 'paper' | 'accent' | 'ink';

// Tracés repris des maquettes (1360×46). Le viewBox garde 8 unités de marge en haut
// pour ne pas rogner les nuages. La zone sous le trait prend la couleur de la section.
const STROKES: Record<EdgeShape, string> = {
  wave: 'M0.9,25.6 C15.8,23.9 60.9,17.7 90.6,15.7 C120.3,13.6 149.0,12.0 179.0,13.4 C208.9,14.9 240.2,20.5 270.2,24.6 C300.2,28.6 328.9,36.1 358.9,37.8 C388.8,39.4 419.6,37.0 449.9,34.5 C480.3,32.0 510.7,26.0 540.9,22.8 C571.1,19.7 601.0,17.4 631.0,15.7 C661.0,14.1 690.7,11.3 720.7,12.9 C750.7,14.6 781.3,21.2 811.0,25.6 C840.8,30.0 869.3,37.3 899.0,39.1 C928.7,41.0 959.2,38.7 989.3,36.5 C1019.5,34.3 1049.8,29.6 1079.8,25.7 C1109.9,21.8 1139.5,14.7 1169.5,13.1 C1199.5,11.5 1229.6,13.9 1259.7,16.1 C1289.8,18.3 1320.0,22.4 1350.2,26.2 C1380.4,30.0 1425.8,36.8 1441.0,38.9',
  'wave-2': 'M1.1,12.5 C16.0,13.5 60.7,15.0 90.3,18.7 C119.9,22.5 149.1,31.9 178.8,34.9 C208.6,38.0 238.9,38.1 268.9,37.2 C299.0,36.3 329.2,32.7 359.4,29.5 C389.5,26.3 419.7,21.0 449.9,17.9 C480.2,14.8 510.8,10.2 540.8,10.7 C570.9,11.2 600.4,17.0 630.3,21.0 C660.3,24.9 690.5,31.2 720.4,34.5 C750.2,37.8 779.3,42.0 809.5,40.8 C839.6,39.6 871.0,31.6 901.2,27.2 C931.4,22.8 960.8,17.4 990.5,14.5 C1020.2,11.6 1049.6,8.2 1079.4,10.0 C1109.1,11.8 1138.9,20.7 1169.0,25.2 C1199.0,29.7 1229.6,35.4 1259.8,37.1 C1289.9,38.9 1319.5,37.1 1349.7,35.7 C1379.9,34.3 1425.6,29.8 1440.8,28.7',
  cloud: 'M0,40 A32,39 0 0 1 64,41 A34,39 0 0 1 128,41 A29,37 0 0 1 192,41 A32,40 0 0 1 256,38 A31,36 0 0 1 320,40 A32,35 0 0 1 384,38 A30,40 0 0 1 448,41 A29,39 0 0 1 512,38 A32,35 0 0 1 576,38 A34,36 0 0 1 640,38 A34,40 0 0 1 704,39 A34,38 0 0 1 768,40 A30,40 0 0 1 832,40 A34,40 0 0 1 896,39 A31,35 0 0 1 960,38 A29,36 0 0 1 1024,40 A29,39 0 0 1 1088,39 A30,39 0 0 1 1152,39 A30,37 0 0 1 1216,40 A29,40 0 0 1 1280,38 A33,40 0 0 1 1344,38 A33,37 0 0 1 1408,40 A29,35 0 0 1 1472,38',
  'cloud-2': 'M0,40 A30,40 0 0 1 64,38 A33,35 0 0 1 128,38 A34,36 0 0 1 192,40 A31,37 0 0 1 256,39 A30,39 0 0 1 320,38 A30,35 0 0 1 384,39 A31,40 0 0 1 448,39 A29,36 0 0 1 512,41 A29,38 0 0 1 576,39 A32,37 0 0 1 640,40 A31,38 0 0 1 704,41 A32,35 0 0 1 768,38 A34,37 0 0 1 832,38 A34,38 0 0 1 896,40 A34,36 0 0 1 960,39 A34,35 0 0 1 1024,41 A29,39 0 0 1 1088,40 A34,40 0 0 1 1152,40 A30,35 0 0 1 1216,40 A32,35 0 0 1 1280,41 A32,39 0 0 1 1344,38 A30,35 0 0 1 1408,39 A30,37 0 0 1 1472,39',
};

/**
 * Bord dessiné posé en haut d'une section (qui doit être en position: relative).
 * Sous 1360px on recadre au lieu d'écraser, pour garder des vagues et des nuages proportionnés.
 */
@Component({
  selector: 'app-edge',
  template: `
    <svg viewBox="0 -8 1360 54" preserveAspectRatio="xMinYMax slice" aria-hidden="true" focusable="false">
      <path [attr.d]="fill()" class="edge-fill" />
      <path [attr.d]="stroke()" class="edge-stroke" vector-effect="non-scaling-stroke" />
    </svg>
  `,
  styleUrl: './edge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"tone-" + tone()' },
})
export class Edge {
  readonly shape = input<EdgeShape>('wave');
  readonly tone = input<EdgeTone>('paper');

  protected readonly stroke = computed(() => STROKES[this.shape()]);
  protected readonly fill = computed(() => `${this.stroke()} L1500,46 L0,46 Z`);
}
