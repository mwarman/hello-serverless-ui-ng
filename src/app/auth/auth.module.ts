import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';
import { SigninComponent } from './signin/signin.component';
import { SignoutComponent } from './signout/signout.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmRegistrationComponent } from './confirm-registration/confirm-registration.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule
  ],
  declarations: [
    SigninComponent,
    SignoutComponent,
    SignupComponent,
    ConfirmRegistrationComponent
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule { }
