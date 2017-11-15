import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './core/router/auth-guard.service';

import { DashboardComponent } from './dashboard/dashboard.component';
import { GreetingListComponent } from './greeting-list/greeting-list.component';
import { GreetingDetailComponent } from './greeting-detail/greeting-detail.component';
import { SigninComponent } from './signin/signin.component';
import { SignoutComponent } from './signout/signout.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmRegistrationComponent } from './confirm-registration/confirm-registration.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'signin', component: SigninComponent },
  { path: 'signout', component: SignoutComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/confirm', component: ConfirmRegistrationComponent },
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
