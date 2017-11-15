import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { GreetingService } from './greeting.service';
import { GreetingListComponent } from './greeting-list/greeting-list.component';
import { GreetingDetailComponent } from './greeting-detail/greeting-detail.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SigninComponent } from './signin/signin.component';
import { AuthService } from './auth.service';
import { SignupComponent } from './signup/signup.component';
import { ConfirmRegistrationComponent } from './confirm-registration/confirm-registration.component';
import { SignoutComponent } from './signout/signout.component';


@NgModule({
  declarations: [
    AppComponent,
    GreetingListComponent,
    GreetingDetailComponent,
    DashboardComponent,
    SigninComponent,
    SignupComponent,
    ConfirmRegistrationComponent,
    SignoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule
  ],
  providers: [
    GreetingService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
