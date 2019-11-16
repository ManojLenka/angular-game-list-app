import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameDetailsComponent } from './components/game-details/game-details.component';
import { CanActivateGuard } from './guards/activation.guard';
import { RootComponent } from './components/root/root.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';

const routes: Routes = [
  {
    path: 'games',
    component: RootComponent,
    canActivate: [CanActivateGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: ':rank',
        component: GameDetailsComponent,
      },
    ]
  },
  {
    path: 'error',
    component: ErrorPageComponent,
  },
  {
    path: '**',
    redirectTo: 'games',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
