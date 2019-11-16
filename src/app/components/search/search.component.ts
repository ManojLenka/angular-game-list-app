import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  disposableSubscriptions: Subscription[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(
    private _sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.getSearchText();
    this.getSearchHints();
  }

  getSearchHints(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => this._sharedService.getSearchHints(term))
      );
  }

  search(): void {
    this._sharedService
    .searchGames(this.myControl.value);
  }

  getSearchText(): void {
    this.disposableSubscriptions.push(
      this._sharedService
      .getSearchText()
      .subscribe((text: string) => {
        this.myControl.setValue(text);
      })
    );
  }

  ngOnDestroy(): void {
    this.disposableSubscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

}
