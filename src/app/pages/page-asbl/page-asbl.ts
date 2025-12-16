import { Component } from '@angular/core';
import {MemberCard} from '../../shared/member-card/member-card';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-page-asbl',
  imports: [
    MemberCard,
    RouterLink
  ],
  templateUrl: './page-asbl.html',
  styleUrl: './page-asbl.scss',
  standalone: true
})
export class PageAsbl {

  team = [
    {
      name: 'Amin Rozas Zabalo',
      role: 'Trésorier',
      photo: 'assets/image-asbl/membres/Amin.jpg',
      bio: "Issu d'une formation en informatique, je pense qu'il est important de venir en aide à la jeunesse via différents projets",
      email: 'aminrozas24@gmail.com',
      linkedin: '',
      facebook: ''
    },
    {
      name: 'Anas Bentatou',
      role: 'Secrétaire',
      photo: 'assets/image-asbl/membres/anas.jpg',
      bio: "Animateur et éducateur en accompagnement psycho-éducatif avec une grande expérience dans l'Aide à la Jeunesse et la vie institutionnelle",
      email: 'benta4525@gmail.com',
      linkedin: '',
      facebook: ''
    },
    {
      name: 'Julien Dubois',
      role: 'Président',
      photo: 'assets/image-asbl/membres/julien2.jpg',
      bio: "Fondateur de projets associatifs et éducateur spécialisé en accompagnement psycho-éducatif avec une grande expérience dans l'Aide à la Jeunesse et la vie institutionnelle",
      email: 'julienissa.dubois@gmail.com',
      linkedin: '',
      facebook: ''
    },
    {
      name: 'Adam Ghannan',
      role: 'Animateur',
      photo: 'assets/image-asbl/membres/adam.jpg',
      bio: "Animateur à Mosaïc ASBL avec une formation de régisseur dans l'événementiel",
      email: 'ghannanadam@outlook.be',
      linkedin: '',
      facebook: ''
    },
    {
      name: 'Saphae Allaoui',
      role: 'Graphic designer',
      photo: 'assets/image-asbl/membres/saphae.jpg',
      bio: 'Infirmière en soins généraux de formation',
      email: 'saphae.allaoui@outlook.fr',
      linkedin: '',
      facebook: ''
    }
    // ajoute autant de membres que nécessaire
  ];

}
