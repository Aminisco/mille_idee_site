import { Component, computed, signal } from '@angular/core';

export type ProjectTag = 'maraude' | 'citoyen' | 'sport' | 'financement';

export interface Project {
  title: string;
  description: string;
  category: string;
  tag: ProjectTag;
  image?: string[];
}

interface Filter {
  key: ProjectTag | 'all';
  label: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projets.html',
  styleUrl: './projets.scss'
})
export class ProjectsComponent {

  private slideIndexMap = new Map<string, number>();

  readonly activeFilter = signal<Filter['key']>('all');

  readonly projects: Project[] = [
    {
      title: 'Hiver Partagé',
      description: 'Proposer un repas et un moment de partage aux sans-abris de Bruxelles, tout en sensibilisant nos jeunes à la précarité omniprésente dans notre capitale.',
      category: 'Maraude',
      tag: 'maraude',
      image: [
        'assets/image_events/maraude_mars.jpg',
        'assets/image_events/photo_groupe.jpg'
      ]
    },
    {
      title: 'Clean Walking — Saint-Gilles',
      description: 'Ramassage des déchets dans les rues du quartier de Saint-Gilles, pour un Bruxelles plus propre et plus solidaire.',
      category: 'Citoyen',
      tag: 'citoyen',
      image: [
        'assets/image_events/cleanwalking1.jpg',
        'assets/image_events/cleanwalking2.jpg'
      ]
    },
    {
      title: 'Atelier Boxe anglaise',
      description: "Atelier découverte organisé en collaboration avec l'ASBL Mosaïc, ouvert à tous les niveaux.",
      category: 'Sport',
      tag: 'sport',
      image: [
        'assets/image_events/boxe1.jpg',
        'assets/image_events/boxe2.jpg'
      ]
    },
    {
      title: 'Vente de bonbons',
      description: "Vente dans les rues de Bruxelles pour financer notre voyage culturel au Canada.",
      category: 'Financement',
      tag: 'financement',
      image: ['assets/image_events/bonbons.jpg']
    }
  ];

  readonly filters: Filter[] = [
    { key: 'all',         label: 'Tous' },
    { key: 'maraude',     label: 'Maraude' },
    { key: 'citoyen',     label: 'Citoyen' },
    { key: 'sport',       label: 'Sport' },
    { key: 'financement', label: 'Financement' },
  ];

  readonly filteredProjects = computed(() => {
    const f = this.activeFilter();
    return f === 'all' ? this.projects : this.projects.filter(p => p.tag === f);
  });

  countFor(key: Filter['key']): number {
    return key === 'all' ? this.projects.length : this.projects.filter(p => p.tag === key).length;
  }

  setFilter(key: Filter['key']): void {
    this.activeFilter.set(key);
  }

  getSlideIndex(title: string): number {
    return this.slideIndexMap.get(title) ?? 0;
  }

  prevSlide(title: string, total: number, event: Event): void {
    event.stopPropagation();
    const current = this.getSlideIndex(title);
    this.slideIndexMap.set(title, (current - 1 + total) % total);
  }

  nextSlide(title: string, total: number, event: Event): void {
    event.stopPropagation();
    const current = this.getSlideIndex(title);
    this.slideIndexMap.set(title, (current + 1) % total);
  }

  setSlide(title: string, index: number): void {
    this.slideIndexMap.set(title, index);
  }
}
