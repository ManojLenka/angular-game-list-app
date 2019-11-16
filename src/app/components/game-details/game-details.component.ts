import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IGame, IGameTable } from 'src/app/models/game.model';
import { SharedService } from 'src/app/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent implements OnInit, OnDestroy {

  disposableSubscription: Subscription[] = [];
  gameTable: IGameTable[] = [];
  displayedColumns: string[] = ['key', 'value'];

  constructor(
    private _sharedService: SharedService,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getGameIdFromRoute();
  }

  getGameIdFromRoute(): void {
    this._route.params.subscribe(params => {
      this.getGameDetails(+params['rank']);
    });
  }

  getGameDetails(rank: number): void {
    this.disposableSubscription.push(
      this._sharedService.getGameDetailsByRank(rank)
      .subscribe((game: IGame) => {
        this.convertDtoToTableFormat(game);
      })
    );
  }

  convertDtoToTableFormat(game: IGame): void {
    if (!!game) {
      const keys = Object.keys(game);
      keys.forEach((key: string) => {
        if (!!key) {
          const gameTableData: IGameTable = {key: key, value: game[key]};
          this.gameTable = [...this.gameTable, gameTableData];
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.disposableSubscription.forEach((s: Subscription) => s.unsubscribe());
  }

}
