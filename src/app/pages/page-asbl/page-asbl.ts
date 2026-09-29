import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Edge } from '../../shared/edge/edge';
import { InkBand } from '../../shared/ink-band/ink-band';
import { Member, MemberCard } from '../../shared/member-card/member-card';

@Component({
  selector: 'app-page-asbl',
  imports: [RouterLink, Edge, InkBand, MemberCard],
  templateUrl: './page-asbl.html',
  styleUrl: './page-asbl.scss',
})
export class PageAsbl {
  protected readonly goals = [
    { icon: 'illustrations/icon_sprout.svg', title: 'Autonomisation des jeunes', text: 'Aider chaque jeune à développer son potentiel personnel et social.' },
    { icon: 'illustrations/icon_door.svg', title: 'Inclusion sociale', text: "Lutter contre l'exclusion par le terrain." },
    { icon: 'illustrations/icon_bulb.svg', title: 'Découverte et créativité', text: "Stimuler l'intérêt pour le sport, l'art, la culture et les projets citoyens." },
    { icon: 'illustrations/icon_hands.svg', title: 'Accompagnement individuel', text: 'Offrir un soutien personnalisé aux jeunes en transition.' },
  ];

  protected readonly method = [
    { title: 'Des projets variés.', text: 'Sport, art, humanitaire, citoyen : quatre terrains pour se construire et créer du lien.' },
    { title: 'Un accompagnement sur mesure.', text: 'Pour les jeunes aux parcours complexes, on propose une écoute active, un soutien scolaire, une aide administrative et une mise en relation avec des partenaires spécialisés.' },
    { title: 'Chaque jeune à son rythme.', text: 'Nos activités évoluent avec les besoins : ateliers, projets citoyens, suivis individuels. Chacun avance à son rythme, sur ce qui lui parle.' },
  ];

  protected readonly team: Member[] = [
    {
      name: 'Julien Dubois',
      role: 'Président, cofondateur',
      photo: 'assets/equipe/julien.jpg',
      bio: 'Fondateur de projets associatifs et éducateur spécialisé, formé en accompagnement psycho-éducatif. Plusieurs années en Aide à la Jeunesse et en milieu institutionnel.',
    },
    {
      name: 'Amin Rozas Zabalo',
      role: 'Trésorier, cofondateur',
      photo: 'assets/equipe/amin.jpg',
      bio: "Informaticien de formation. Convaincu qu'on peut aider les jeunes via des projets concrets, sportifs comme citoyens.",
    },
    {
      name: 'Anas Bentatou',
      role: 'Secrétaire, cofondateur',
      photo: 'assets/equipe/anas.jpg',
      bio: "Animateur et éducateur en accompagnement psycho-éducatif, avec une grande expérience dans l'Aide à la Jeunesse et la vie institutionnelle.",
    },
    {
      name: 'Saphae Allaoui',
      role: 'Chargée de communication et de partenariat',
      bio: 'Infirmière en soins généraux de formation.',
    },
    {
      name: 'Adam Ghannan',
      role: 'Animateur',
      photo: 'assets/equipe/adam.jpg',
      bio: "Animateur à l'asbl Mosaïc, avec une formation de régisseur dans l'événementiel.",
    },
  ];
}
