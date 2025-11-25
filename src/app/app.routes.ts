import { Routes } from '@angular/router';
import {PageAsbl} from './pages/page-asbl/page-asbl';
import {Home} from './pages/home/home';
import {Contact} from './pages/contact/contact';
import {Projets} from './pages/projets/projets';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: "full"},
  {path: 'home', component: Home},
  {path: 'asbl', component: PageAsbl},
  {path: 'contact', component: Contact},
  {path: 'projets', component: Projets}

];

export class AppRoutes{

}
