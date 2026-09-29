import { Routes } from '@angular/router';
import { PageAsbl } from './pages/page-asbl/page-asbl';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { ProjectsComponent } from './pages/projets/projets';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home, title: 'Mille Idées, asbl de jeunes à Bruxelles' },
  { path: 'asbl', component: PageAsbl, title: "L'asbl · Mille Idées" },
  { path: 'projets', component: ProjectsComponent, title: 'Projets · Mille Idées' },
  { path: 'contact', component: Contact, title: 'Contact · Mille Idées' },
];
