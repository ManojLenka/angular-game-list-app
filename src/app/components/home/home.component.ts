import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { SORTING } from 'src/app/constants/config.constant';
import { IGame } from 'src/app/models/game.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  visibleGames$: Observable<IGame[]> = new Observable<IGame[]>();

  constructor(
    private _sharedService: SharedService,
  ) { }

  ngOnInit() {
    this._sharedService.getCSVData();
    this.getVisibleGames();
  }

  getVisibleGames(): void {
    this.visibleGames$ = this._sharedService
    .getVisibleGames();
  }

}
