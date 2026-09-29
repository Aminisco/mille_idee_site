export type ProjectTag = 'maraude' | 'citoyen' | 'sport' | 'financement';

export type PhotoShape = 'pebble' | 'pebble-2' | 'leaf' | 'arch' | 'cut';

export interface Project {
  slug: string;
  title: string;
  tag: ProjectTag;
  /** ISO, le jour 01 veut dire « mois entier » */
  date: string;
  /** Version courte, pour l'accueil */
  summary: string;
  description: string;
  /** position: 'top' pour les affiches, dont le titre est en haut */
  photo?: { src: string; alt: string; shape: PhotoShape; position?: 'top' };
  /** Grand dessin si le projet n'a aucune photo, autocollant sinon */
  doodle: string;
}

export const TAG_LABELS: Record<ProjectTag, string> = {
  maraude: 'Maraude',
  citoyen: 'Citoyen',
  sport: 'Sport',
  financement: 'Financement',
};

export const PROJECTS: Project[] = [
  {
    slug: 'gaufres',
    title: 'Vente de gaufres',
    tag: 'financement',
    date: '2026-06-01',
    summary: 'Pour financer nos prochains projets. Tu veux en commander ? Écris-nous.',
    description: "Pour financer nos prochains projets. Envie d'en commander ? Écris-nous depuis la page contact, on te répond rapidement.",
    photo: {
      src: 'assets/photos/gaufres.jpg',
      alt: 'Affiche de la vente de gaufres : 10 € la boîte, vanille ou chocolat',
      shape: 'pebble',
      position: 'top',
    },
    doodle: 'illustrations/waffle.svg',
  },
  {
    slug: 'hiver-partage',
    title: 'Hiver Partagé',
    tag: 'maraude',
    date: '2026-03-01',
    summary: 'Un repas et un moment de partage avec les sans-abris de Bruxelles, pour sensibiliser nos jeunes à la précarité.',
    description: 'Un repas et un moment de partage avec les sans-abris de Bruxelles, pour sensibiliser nos jeunes à la précarité.',
    photo: {
      src: 'assets/photos/hiver-partage.jpg',
      alt: "Photo de groupe des jeunes et des bénévoles, le soir d'Hiver Partagé",
      shape: 'cut',
    },
    doodle: 'illustrations/bowl.svg',
  },
  {
    slug: 'boxe',
    title: 'Atelier boxe anglaise',
    tag: 'sport',
    date: '2025-12-24',
    summary: "Atelier découverte avec l'asbl Mosaïc, ouvert à tous les niveaux.",
    description: "Atelier découverte organisé avec l'asbl Mosaïc, ouvert à tous les niveaux.",
    photo: {
      src: 'assets/photos/boxe-atelier.jpg',
      alt: 'Des jeunes enchaînent les exercices de boxe, gants aux mains, devant un mur de briques orange',
      shape: 'arch',
    },
    doodle: 'illustrations/gloves.svg',
  },
  {
    slug: 'bonbons',
    title: 'Vente de bonbons',
    tag: 'financement',
    date: '2025-12-06',
    summary: 'Vente dans les rues de Bruxelles pour financer notre voyage culturel au Canada.',
    description: 'Vente dans les rues de Bruxelles pour financer notre voyage culturel au Canada.',
    photo: {
      src: 'assets/photos/bonbons.jpg',
      alt: 'Sachets de bonbons préparés pour la vente',
      shape: 'leaf',
    },
    doodle: 'illustrations/candy.svg',
  },
  {
    slug: 'clean-walking',
    title: 'Clean Walking à Saint-Gilles',
    tag: 'citoyen',
    date: '2025-08-01',
    summary: 'Ramassage des déchets dans les rues du quartier, pour un Bruxelles plus propre et plus solidaire.',
    description: 'Ramassage des déchets dans les rues du quartier, pour un Bruxelles plus propre et plus solidaire.',
    photo: {
      src: 'assets/photos/cleanwalking.jpg',
      alt: 'Deux jeunes ramassent des déchets dans un parc à Saint-Gilles',
      shape: 'pebble',
    },
    doodle: 'illustrations/bag.svg',
  },
  {
    slug: 'maraude-estivale',
    title: 'Maraude estivale',
    tag: 'maraude',
    date: '2025-06-01',
    summary: "L'été, la précarité reste. Sortie en équipe à travers Bruxelles, avec eau, vivres et discussion.",
    description: "L'été, la précarité reste. Sortie en équipe à travers Bruxelles, avec eau, vivres et discussion.",
    photo: {
      src: 'assets/photos/maraude-estivale.jpg',
      alt: "Affiche illustrée de la maraude estivale devant l'hôtel de ville de Bruxelles",
      shape: 'pebble-2',
      position: 'top',
    },
    doodle: 'illustrations/sunbottle.svg',
  },
  // TODO(étape 5) : image_events/première-maraude.jpeg montre l'affiche d'Hiver Partagé,
  // pas la première maraude. Retrouver la bonne photo avant de l'afficher.
  {
    slug: 'premiere-maraude',
    title: 'Première maraude',
    tag: 'maraude',
    date: '2024-11-01',
    summary: "Notre toute première sortie maraude à Bruxelles : repas chauds, vêtements et un temps d'écoute avec les personnes à la rue.",
    description: "Notre toute première sortie maraude à Bruxelles : repas chauds, vêtements et un temps d'écoute avec les personnes à la rue.",
    doodle: 'illustrations/sunbottle.svg',
  },
];

const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

/** « Juin 2026 », ou « 24 décembre 2025 » quand le jour est connu */
export function formatProjectDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const label = day === 1 ? `${MONTHS[month - 1]} ${year}` : `${day} ${MONTHS[month - 1]} ${year}`;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function findProject(slug: string): Project {
  const project = PROJECTS.find(p => p.slug === slug);
  if (!project) throw new Error(`Projet inconnu : ${slug}`);
  return project;
}
