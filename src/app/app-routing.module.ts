import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { NotfoundComponent } from './core/notfound/notfound.component';

const routes: Routes = [
  {path: 'notfound', component: NotfoundComponent},
  {path: '**', redirectTo: 'notfound'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
