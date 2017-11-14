import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { GreetingService } from './greeting.service';
import { GreetingListComponent } from './greeting-list/greeting-list.component';
import { GreetingDetailComponent } from './greeting-detail/greeting-detail.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SigninComponent } from './signin/signin.component';
import { AuthService } from './auth.service';
import { AwsSignInterceptor } from './aws-sign.interceptor';
import { ApiGatewayService } from './api-gateway.service';
import { AuthGuardService } from './auth-guard.service';
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
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AwsSignInterceptor,
      multi: true,
    },
    GreetingService,
    AuthService,
    ApiGatewayService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
