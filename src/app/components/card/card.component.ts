import { Component, OnInit, Input } from '@angular/core';
import { IGame } from 'src/app/models/game.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() game: IGame;

  constructor() { }

  ngOnInit() {
  }

}
