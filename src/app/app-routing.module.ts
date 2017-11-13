import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './auth-guard.service';

import { DashboardComponent } from './dashboard/dashboard.component';
import { GreetingListComponent } from './greeting-list/greeting-list.component';
import { GreetingDetailComponent } from './greeting-detail/greeting-detail.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'signin', component: SigninComponent },
  { path: 'greetings', component: GreetingListComponent, canActivate: [AuthGuardService] },
  { path: 'greetings/:id', component: GreetingDetailComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
