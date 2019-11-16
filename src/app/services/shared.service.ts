import { Injectable, Output, EventEmitter } from '@angular/core';
import { Papa, PapaParseResult } from 'ngx-papaparse';
import { CONFIGURATION, SORTING } from '../constants/config.constant';
import { IGame, IPageInfo } from '../models/game.model';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private pageNo: number;
  private perPageRecord: number;
  private searchText: string = '';
  private sortBy: string = SORTING.rank;
  private mapHints: Map<string, string[]> = new Map<string, string[]>();

  private allGames: IGame[] = [];
  private searchedGames: IGame[] = [];

  private filteredGames$: BehaviorSubject<IGame[]> = new BehaviorSubject<IGame[]>([]);
  private visibleGames$: BehaviorSubject<IGame[]> = new BehaviorSubject<IGame[]>([]);

  @Output() pageUpdate: EventEmitter<IPageInfo> = new EventEmitter<IPageInfo>();

  constructor(private _papa: Papa) { }

  compareByNewRelease(a: IGame, b: IGame): number {
    if (a.Year > b.Year) {
      return -1;
    }
    if (a.Year < b.Year) {
      return 1;
    }
    return 0;
  }

  compareByRank(a: IGame, b: IGame): number {
    if (a.Rank < b.Rank) {
      return -1;
    }
    if (a.Rank > b.Rank) {
      return 1;
    }
    return 0;
  }

  compareBy(a: string, b: string): number {
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    }
    if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
    return 0;
  }

  getCSVData(): Observable<boolean> {
    return new Observable((observer) => {
      this._papa.parse(CONFIGURATION.csvFilePath, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results: PapaParseResult) => {
          const games = results.data as IGame[];
          this.allGames = games;
          this.searchedGames = games;
          this.filteredGames$.next(this.searchedGames);
          this.getGamesForPage();
          observer.next(true);
          observer.complete();
        },
        error: () => {
          observer.error(false);
        }
      });
    });
  }

  sortGames(sortBy: string = SORTING.rank): void {
    if (this.sortBy !== sortBy) {
      this.sortBy = sortBy;
      const compareFn = (sortBy === SORTING.newRelease) ? this.compareByNewRelease : this.compareByRank;
      this.allGames = [...this.allGames.sort(compareFn)];
      this.searchGames(this.searchText, true);
    }
  }

  searchGames(searchText: string = '', forceSearch?: boolean): void {
    if (!!forceSearch || this.searchText.toLowerCase() !== searchText.toLowerCase()) {
      this.searchText = searchText;
      const searchedGames = this.allGames.filter((game: IGame) => {
        return game.Name.toString().toLowerCase().startsWith(searchText.toLowerCase());
      });
      this.searchedGames = [...searchedGames];
      this.getGamesForPage(0, this.perPageRecord, true);
      this.filteredGames$.next(this.searchedGames);
    }
  }

  getGamesForPage(pageNo: number = 0, perPageRecord: number = 10, force?: boolean): void {
    if (!!force || this.pageNo !== pageNo || this.perPageRecord !== perPageRecord) {
      this.pageNo = pageNo;
      this.perPageRecord = perPageRecord;
      const startPageNumber = pageNo * perPageRecord;
      this.pageUpdate.emit({pageIndex: pageNo, pageSize: perPageRecord});
      const visibleGames = this.searchedGames.slice(startPageNumber, startPageNumber + perPageRecord);
      this.visibleGames$.next(visibleGames);
    }
  }

  setMap(searchText: string, searchedHints: string[]): boolean {
    if (!!searchedHints && searchedHints.length > 0) {
      this.mapHints.set(searchText, searchedHints);
      return true;
    }
    return false;
  }

  findSearchTextInMap(searchText: string): string[] {
    for (let i = 0; i < searchText.length; i++) {
      const searchKey = searchText.slice(0, searchText.length - i);
      if (this.mapHints.has(searchKey)) {
        if (searchText === searchKey) {
          return this.mapHints.get(searchText);
        }
        const searchedHints = this.mapHints
          .get(searchKey)
          .filter((name: string) => name.toString().toLowerCase().startsWith(searchText.toLowerCase()))
          .sort(this.compareBy);
        if (this.setMap(searchText, searchedHints)) {
          return this.mapHints.get(searchText).slice(0, 100);
        } else {
          return [];
        }
      }
    }
    return null;
  }

  getSearchHints(searchText: string): Observable<string[]> {
    if (!!searchText) {
      let searchedHints = this.findSearchTextInMap(searchText);
      if (!!searchedHints) {
        return of(searchedHints);
      }
      searchedHints = this.allGames
      .reduce((acc: string[], game: IGame) => {
        if (game.Name.toString().toLowerCase().startsWith(searchText.toLowerCase())) {
          acc.push(game.Name);
        }
        return acc;
      }, [])
      .sort(this.compareBy);
      if (this.setMap(searchText, searchedHints)) {
        return of(this.mapHints.get(searchText).slice(0, 100));
      } else {
        return of([]);
      }
    }
    return of([]);
  }

  getFilteredGames(): Observable<IGame[]> {
    return this.filteredGames$;
  }

  getVisibleGames(): Observable<IGame[]> {
    return this.visibleGames$;
  }

  getGameDetailsByRank(rank: number): Observable<IGame> {
    return of(this.allGames.find((game: IGame) => game.Rank === +rank));
  }

  getInitialPage(): Observable<IPageInfo> {
    return of({ pageSize: this.perPageRecord, pageIndex: this.pageNo });
  }

  getSortingOrder(): Observable<string> {
    return of(this.sortBy);
  }

  getSearchText(): Observable<string> {
    return of(this.searchText);
  }

}
