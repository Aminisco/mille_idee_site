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
      name: 'Julien Dubois',
      role: 'Président',
      photo: 'assets/image-asbl/membres/julien2.jpg',
      bio: "Fondateur de projets associatifs et éducateur spécialisé, formé en accompagnement psycho-éducatif. Plusieurs années en Aide à la Jeunesse et en milieu institutionnel.",
      email: 'julienissa.dubois@gmail.com',
      linkedin: '',
      facebook: '',
      cofounder: true
    },
    {
      name: 'Amin Rozas Zabalo',
      role: 'Trésorier',
      photo: 'assets/image-asbl/membres/Amin.jpg',
      bio: "Informaticien de formation. Convaincu qu'on peut aider les jeunes via des projets concrets, sportifs comme citoyens.",
      email: 'aminrozas24@gmail.com',
      linkedin: '',
      facebook: '',
      cofounder: true
    },
    {
      name: 'Anas Bentatou',
      role: 'Secrétaire',
      photo: 'assets/image-asbl/membres/anas.jpg',
      bio: "Animateur et éducateur en accompagnement psycho-éducatif avec une grande expérience dans l'Aide à la Jeunesse et la vie institutionnelle",
      email: 'benta4525@gmail.com',
      linkedin: '',
      facebook: '',
      cofounder: true
    },
    {
      name: 'Saphae Allaoui',
      role: 'Chargée de communication et de partenariat',
      photo: 'assets/image-asbl/membres/saphae.jpg',
      bio: 'Infirmière en soins généraux de formation',
      email: 'saphae.allaoui@outlook.fr',
      linkedin: '',
      facebook: '',
      cofounder: false
    },
    {
      name: 'Adam Ghannan',
      role: 'Animateur',
      photo: 'assets/image-asbl/membres/adam.jpg',
      bio: "Animateur à Mosaïc ASBL avec une formation de régisseur dans l'événementiel",
      email: 'ghannanadam@outlook.be',
      linkedin: '',
      facebook: '',
      cofounder: false
    },
    // ajoute autant de membres que nécessaire
  ];

}
