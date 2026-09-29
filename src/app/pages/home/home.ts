import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Edge } from '../../shared/edge/edge';
import { InkBand } from '../../shared/ink-band/ink-band';
import { PhotoShape, Project, TAG_LABELS, findProject, formatProjectDate } from '../../data/projects';

interface HomeProject {
  project: Project;
  shape?: PhotoShape;
}

interface Slide {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// La forme peut changer d'une page à l'autre pour éviter deux galets côte à côte
const featured = (slug: string, shape?: PhotoShape): HomeProject => {
  const project = findProject(slug);
  return { project, shape: shape ?? project.photo?.shape };
};

@Component({
  selector: 'app-home',
  imports: [RouterLink, Edge, InkBand],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly tagLabels = TAG_LABELS;
  protected readonly formatDate = formatProjectDate;

  protected readonly terrains = [
    { name: 'Sport', text: "Atelier boxe anglaise avec l'asbl Mosaïc, ouvert à tous les niveaux." },
    // TODO(comité) : pas encore de projet artistique, ce texte est une invitation à en proposer un
    { name: 'Art', text: 'Des projets artistiques à imaginer avec les jeunes. Une idée ? Écris-nous.' },
    { name: 'Humanitaire', text: 'Maraudes et repas partagés avec les sans-abris de Bruxelles.' },
    { name: 'Citoyen', text: 'Clean Walking à Saint-Gilles, pour un Bruxelles plus propre et plus solidaire.' },
  ];

  // Deux colonnes décalées, comme la maquette
  protected readonly projectColumns: HomeProject[][] = [
    [featured('gaufres', 'pebble-2'), featured('clean-walking'), featured('bonbons')],
    [featured('hiver-partage', 'leaf'), featured('maraude-estivale', 'arch'), featured('boxe', 'pebble-2')],
  ];

  protected readonly slides: Slide[] = [
    { src: 'assets/photos/vie/maraude-mars.jpg', alt: 'Maraude de nuit dans Bruxelles, sacs de vivres à la main', width: 1000, height: 667 },
    { src: 'assets/photos/vie/photo-groupe.jpg', alt: 'Photo de groupe des jeunes et des bénévoles, le soir de la maraude', width: 1000, height: 667 },
    { src: 'assets/photos/vie/cleanwalking1.jpg', alt: 'Deux jeunes remplissent un sac poubelle dans un parc à Saint-Gilles', width: 675, height: 900 },
    { src: 'assets/photos/vie/cleanwalking2.jpg', alt: 'Un jeune ramasse des déchets au pied d’un arbre', width: 675, height: 900 },
    { src: 'assets/photos/vie/boxe1.jpg', alt: 'Atelier boxe anglaise avec l’asbl Mosaïc', width: 675, height: 900 },
    { src: 'assets/photos/vie/boxe2.jpg', alt: 'Des jeunes enchaînent les exercices de boxe, gants aux mains', width: 675, height: 900 },
    { src: 'assets/photos/vie/bonbons.jpg', alt: 'Un plateau de sachets de bonbons pendant la vente dans la rue', width: 675, height: 900 },
  ];
  protected readonly slideShapes: PhotoShape[] = ['cut', 'leaf', 'arch'];

  protected readonly atStart = signal(true);
  protected readonly atEnd = signal(false);

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  scrollSlides(direction: 1 | -1): void {
    const track = this.track().nativeElement;
    const slide = track.querySelector<HTMLElement>('li');
    const step = slide ? slide.offsetWidth + parseFloat(getComputedStyle(track).columnGap || '0') : track.clientWidth;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * step, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  onTrackScroll(): void {
    const track = this.track().nativeElement;
    this.atStart.set(track.scrollLeft <= 4);
    this.atEnd.set(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
  }
}
