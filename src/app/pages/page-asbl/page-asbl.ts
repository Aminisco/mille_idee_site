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
})
export class PageAsbl {

  team = [
    {
      name: 'Rozas Zabalo Amin',
      role: 'Trésorier',
      photo: 'assets/image-asbl/membres/Amin.jpg',
      bio: 'Developpeur informatique',
      email: 'email@example.com',
      linkedin: '',
      facebook: ''
    },
    {
      name: 'Alarcon Isco',
      role: 'Coordinateur',
      photo: 'assets/image-asbl/membres/Avatar2.jpg',
      bio: "Pas d'inspiration donc j'écris au hasard sa mère",
      email: 'email@example.com',
      linkedin: '',
      facebook: ''
    },
    {
      name: 'Dubois Julien',
      role: 'Président',
      photo: 'assets/image-asbl/membres/julien.jpg',
      bio: "Le big J, le boss de l'asso, tranquille c'est une imaghe d'exemple",
      email: 'email@example.com',
      linkedin: '',
      facebook: ''
    },
    {
      name: 'Leo Messi',
      role: 'Goat',
      photo: 'assets/image-asbl/membres/MESSI.jpg',
      bio: "Le goat tout simplement",
      email: 'email@example.com',
      linkedin: '',
      facebook: ''
    },
    {
      name: 'Rozas Zabalo Amin',
      role: 'Trésorier',
      photo: 'assets/image-asbl/membres/Amin.jpg',
      bio: 'Developpeur informatique',
      email: 'email@example.com',
      linkedin: '',
      facebook: ''
    }
    // ajoute autant de membres que nécessaire
  ];

}
