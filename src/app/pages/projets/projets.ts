import { Component } from '@angular/core';

export interface Project {
  title: string;
  description: string;
  category: string;
  tag: 'maraude' | 'citoyen' | 'sport' | 'financement' | 'avenir';
  image?: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projets.html',
  styleUrl: './projets.scss'
})
export class ProjectsComponent {

  private slideIndexMap = new Map<string, number>();

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

  sections: { label: string; note?: string; projects: Project[] }[] = [
    {
      label: 'Maraudes',
      projects: [
        {
          title: 'Hiver Partagé',
          description: 'Proposer un repas et un moment de partage aux sans-abris de Bruxelles, tout en sensibilisant nos jeunes à la précarité omniprésente dans notre capitale.',
          category: 'Maraude',
          tag: 'maraude',
          image: ['assets/image_events/maraude_mars.jpg',
          'assets/image_events/photo_groupe.jpg']
        }
      ]
    },
    {
      label: 'Projets citoyens',
      projects: [
        {
          title: 'Clean Walking — Saint-Gilles',
          description: 'Ramassage des déchets dans les rues du quartier de Saint-Gilles, pour un Bruxelles plus propre et plus solidaire.',
          category: 'Citoyen',
          tag: 'citoyen',
          image : [
            'assets/image_events/cleanwalking1.jpg',
            'assets/image_events/cleanwalking2.jpg'
          ]
        }
      ]
    },
    {
      label: 'Projets sportifs',
      projects: [
        {
          title: 'Atelier Boxe anglaise',
          description: 'Atelier découverte organisé en collaboration avec l\'ASBL Mosaïc, ouvert à tous les niveaux.',
          category: 'Sport',
          tag: 'sport',
          image : [
            'assets/image_events/boxe1.jpg',
            'assets/image_events/boxe2.jpg'
          ]
        }
      ]
    },
    {
      label: 'Auto-financement',
      note: 'Dans le but de réaliser un voyage culturel au Canada, nous menons différentes actions de vente et d\'auto-financement.',
      projects: [
        {
          title: 'Vente de bonbons',
          description: 'Vente dans les rues de Bruxelles pour financer notre voyage culturel au Canada.',
          category: 'Financement',
          tag: 'financement',
          image : [
            'assets/image_events/bonbons.jpg'
          ]
        }
      ]
    },
    {
      label: 'Projets à venir',
      projects: []
    }
  ];
}
