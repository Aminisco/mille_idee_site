import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export type ProjectTag = 'maraude' | 'citoyen' | 'sport' | 'financement';

export interface Project {
  title: string;
  description: string;
  category: string;
  tag: ProjectTag;
  date: string;
  image?: string[];
}

interface Filter {
  key: ProjectTag | 'all';
  label: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './projets.html',
  styleUrl: './projets.scss'
})
export class ProjectsComponent {

  private slideIndexMap = new Map<string, number>();
  private readonly today = new Date().toISOString().slice(0, 10);

  readonly activeFilter = signal<Filter['key']>('all');

  readonly projects: Project[] = [
    {
      title: 'Vente de gaufres',
      description: "Vente de gaufres à venir, pour financer nos prochains projets. Envie d'en commander ? Écrivez-nous depuis la page contact, on revient vers vous rapidement.",
      category: 'Financement',
      tag: 'financement',
      date: '2026-06-01',
      image: ['assets/image_events/gaufre.jpeg']
    },
    {
      title: 'Hiver Partagé',
      description: 'Proposer un repas et un moment de partage aux sans-abris de Bruxelles, tout en sensibilisant nos jeunes à la précarité omniprésente dans notre capitale.',
      category: 'Maraude',
      tag: 'maraude',
      date: '2026-03-01',
      image: [
        'assets/image_events/maraude_mars.jpg',
        'assets/image_events/photo_groupe.jpg'
      ]
    },
    {
      title: 'Première maraude',
      description: "Notre toute première sortie maraude à Bruxelles : repas chauds, vêtements et un temps d'écoute avec les personnes à la rue.",
      category: 'Maraude',
      tag: 'maraude',
      date: '2024-11-01',
      image: [
        'assets/image_events/première-maraude.jpeg'
      ]
    },
    {
      title: 'Maraude estivale',
      description: "L'été, la précarité reste. Sortie en équipe à travers Bruxelles, avec eau, vivres et discussion.",
      category: 'Maraude',
      tag: 'maraude',
      date: '2025-06-01',
      image: [
        'assets/image_events/maraude-estivale.jpeg'
      ]
    },
    {
      title: 'Clean Walking — Saint-Gilles',
      description: 'Ramassage des déchets dans les rues du quartier de Saint-Gilles, pour un Bruxelles plus propre et plus solidaire.',
      category: 'Citoyen',
      tag: 'citoyen',
      date: '2025-08-01',
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
      date: '2025-12-24',
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
      date: '2025-12-06',
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

  readonly upcomingProjects = computed(() =>
    [...this.projects]
      .filter(p => p.date >= this.today)
      .sort((a, b) => a.date.localeCompare(b.date))
  );

  readonly pastProjects = computed(() =>
    this.projects.filter(p => p.date < this.today)
  );

  readonly filteredProjects = computed(() => {
    const f = this.activeFilter();
    const past = this.pastProjects();
    const list = f === 'all' ? past : past.filter(p => p.tag === f);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  });

  private readonly months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  formatDate(iso: string): string {
    const [y, m, d] = iso.split('-');
    const monthName = this.months[parseInt(m, 10) - 1];
    return d === '01' ? `${monthName} ${y}` : `${parseInt(d, 10)} ${monthName} ${y}`;
  }

  countFor(key: Filter['key']): number {
    const past = this.pastProjects();
    return key === 'all' ? past.length : past.filter(p => p.tag === key).length;
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
