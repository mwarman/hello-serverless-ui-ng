import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../core/router/auth-guard.service';
import { GreetingComponent } from './greeting.component';
import { GreetingListComponent } from './list/greeting-list.component';
import { GreetingDetailComponent } from './detail/greeting-detail.component';

const routes: Routes = [
  {
    path: 'greetings',
    component: GreetingComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', component: GreetingListComponent },
      { path: ':id', component: GreetingDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GreetingRoutingModule { }
