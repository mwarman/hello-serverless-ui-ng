import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NavbarComponent } from './navbar/navbar.component';
import { requestOptionsProvider } from './http/default-request-options.service';
import { AuthGuardService } from './router/auth-guard.service';
import { ApiGatewayService } from './aws/api-gateway.service';
import { AwsSignInterceptor } from './http/aws-sign.interceptor';
import { ConfigService } from './config/config.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  declarations: [
    NavbarComponent
  ],
  exports: [
    NavbarComponent
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: AwsSignInterceptor,
      multi: true,
    },
    requestOptionsProvider,
    AuthGuardService,
    ApiGatewayService,
    ConfigService
  ]
})
export class CoreModule { }
