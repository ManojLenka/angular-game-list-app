import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Observable } from 'rxjs';
import { IGame } from 'src/app/models/game.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {

  visibleGames$: Observable<IGame[]> = new Observable<IGame[]>();

  constructor(
    private _sharedService: SharedService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getVisibleGames();
  }

  getVisibleGames(): void {
    this.visibleGames$ = this._sharedService
    .getVisibleGames();
  }

  selectGame(game: IGame): void {
    this._router.navigate([`${game.Rank}`], {
      relativeTo: this._route
    });
  }

}
