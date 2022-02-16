import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateDeckComponent } from './create-deck/create-deck.component';
import { OpenDeckComponent } from './open-deck/open-deck.component';

const routes: Routes = [
  { path: 'create-deck', component: CreateDeckComponent },
  { path: 'open-deck', component: OpenDeckComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
