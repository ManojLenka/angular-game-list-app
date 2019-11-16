import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { PapaParseModule } from 'ngx-papaparse';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomMaterialModule } from './modules/custom-material.module';
import { SearchComponent } from './components/search/search.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { CardComponent } from './components/card/card.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { SortComponent } from './components/sort/sort.component';
import { GameDetailsComponent } from './components/game-details/game-details.component';
import { RootComponent } from './components/root/root.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    PaginatorComponent,
    CardComponent,
    CardListComponent,
    SortComponent,
    GameDetailsComponent,
    RootComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PapaParseModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
