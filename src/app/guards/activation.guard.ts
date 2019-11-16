import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {

    constructor(
        private _sharedService: SharedService,
        private router: Router,
    ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this._sharedService
      .getCSVData()
      .subscribe((gotData: boolean) => {
        if (!gotData) {
          this.router.navigate(['/error']);
          observer.next(false);
        }
        observer.next(gotData);
        observer.complete();
      },
      (err: Error) => {
        this.router.navigate(['/error']);
        observer.next(false);
      });
    });
  }

}
