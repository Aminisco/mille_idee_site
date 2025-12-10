import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [],
  templateUrl: './member-card.html',
  styleUrl: './member-card.scss',
})
export class MemberCard {

  @Input() name!: string;
  @Input() role!: string;
  @Input() photo!: string;
  @Input() bio?: string;

  @Input() email?: string;
  @Input() linkedin?: string;
  @Input() facebook?: string;

}
