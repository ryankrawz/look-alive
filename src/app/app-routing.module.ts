import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateDeckComponent } from './create-deck/create-deck.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PlayComponent } from './play/play.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create-deck', component: CreateDeckComponent },
  { path: 'play', component: PlayComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
