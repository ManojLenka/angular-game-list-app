import { Component, OnInit, OnDestroy } from '@angular/core';
import { SORT_BY, SORTING } from 'src/app/constants/config.constant';
import { MatSelectChange } from '@angular/material';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent implements OnInit, OnDestroy {

  disposableSubscriptions: Subscription[] = [];
  sortBy = SORT_BY;
  sorting = SORTING;

  selected = '';

  constructor(
    private _sharedService: SharedService,
  ) {
  }

  ngOnInit() {
    this.getSortingOrder();
  }

  getSortingOrder(): void {
    this.disposableSubscriptions.push(
      this._sharedService
      .getSortingOrder()
      .subscribe((order: string) => {
        this.selected = order;
      })
    );
  }

  selectionChange(event: MatSelectChange): void {
    this._sharedService
      .sortGames(this.selected);
  }

  ngOnDestroy(): void {
    this.disposableSubscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

}
