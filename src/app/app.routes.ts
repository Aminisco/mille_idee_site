import { Routes } from '@angular/router';
import { PageAsbl } from './pages/page-asbl/page-asbl';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { ProjectsComponent } from './pages/projets/projets';
import { NotFound } from './pages/not-found/not-found';

// Les descriptions apparaissent sous le titre dans Google et dans les aperçus de partage (~155 caractères max)
export const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full',
    title: 'Mille Idées, asbl de jeunes à Bruxelles',
    data: {
      description: 'Asbl portée par les jeunes de Bruxelles : sport, art, maraudes, projets citoyens. Rendez-vous tous les samedis de 16h à 19h au Centre Benenzon, à Schaerbeek.',
    },
  },
  // Ancienne adresse de l'accueil, redirigée en 301 par Netlify
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: 'asbl',
    component: PageAsbl,
    title: 'Qui on est · Mille Idées, asbl de jeunes à Bruxelles',
    data: {
      description: "Lutter contre l'exclusion sociale et aider les jeunes de Bruxelles à s'affirmer comme citoyens. Ce qu'on veut, comment on travaille, et l'équipe bénévole.",
    },
  },
  {
    path: 'projets',
    component: ProjectsComponent,
    title: 'Projets : maraudes, sport, actions citoyennes · Mille Idées',
    data: {
      description: 'Maraudes, Hiver Partagé, atelier de boxe, Clean Walking, ventes de gaufres et de bonbons : les projets montés par et pour les jeunes de Bruxelles depuis 2024.',
    },
  },
  {
    path: 'contact',
    component: Contact,
    title: 'Contact · Mille Idées, asbl à Schaerbeek',
    data: {
      description: 'Une question, une idée de projet ? Écris-nous, ou passe le samedi de 16h à 19h au Centre Benenzon, avenue Général Eisenhower 132, à Schaerbeek.',
    },
  },
  { path: '**', component: NotFound, title: 'Page introuvable · Mille Idées', data: { noindex: true } },
];
