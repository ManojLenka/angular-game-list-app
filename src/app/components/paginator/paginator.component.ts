import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { SharedService } from 'src/app/services/shared.service';
import { IGame, IPageInfo } from 'src/app/models/game.model';
import { MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnDestroy {

  disposableSubscription: Subscription[] = [];
  totalGames: number = 0;
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.getFilteredGames();
    this.pageUpdate();
    this.getInitialPage();
  }

  setPage(pageInfo: IPageInfo): void {
    this.pageSize = pageInfo.pageSize;
    this.pageIndex = pageInfo.pageIndex;
    this.paginator.pageIndex = pageInfo.pageIndex;
    this.paginator.pageSize = pageInfo.pageSize;
  }

  getInitialPage(): void {
    this.disposableSubscription.push(
      this._sharedService
      .getInitialPage()
      .subscribe((pageInfo: IPageInfo) => {
        this.setPage(pageInfo);
      })
    );
  }

  pageUpdate(): void {
    this.disposableSubscription.push(
      this._sharedService
      .pageUpdate
      .subscribe((pageInfo: IPageInfo) => {
        this.setPage(pageInfo);
      })
    );
  }

  pageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this._sharedService
      .getGamesForPage(this.pageIndex, this.pageSize);
  }

  getFilteredGames(): void {
    this.disposableSubscription.push(
      this._sharedService
      .getFilteredGames()
      .subscribe((games: IGame[]) => {
        this.totalGames = games.length;
      })
    );
  }

  ngOnDestroy(): void {
    this.disposableSubscription.forEach((s: Subscription) => s.unsubscribe());
  }

}
