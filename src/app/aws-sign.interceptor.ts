import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import * as AWS from 'aws-sdk';

import { AuthService } from './auth.service';
import { ApiGatewayService } from './api-gateway.service';

@Injectable()
export class AwsSignInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private apiGatewayService: ApiGatewayService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`> AwsSignInterceptor.intercept`);

    // if not authenticated, continue without adding headers
    if (!this.authService.isAuthenticated()) {
      return next.handle(req);
    }

    let url = new URL(req.url);

    let request = {
      verb: req.method.toUpperCase(),
      path: url.pathname,
      headers: {},
      queryParams: {},
      body: req.body
    };
    console.log(`request: ${JSON.stringify(request, null, 2)}`);

    let config = {
      accessKey: AWS.config.credentials.accessKeyId,
      secretKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      serviceName: 'execute-api',
      region: AWS.config.region,
      endpoint: 'https://dev-api.leanstacks.net',
      apiKey: undefined,
      defaultContentType: 'application/json',
      defaultAcceptType: 'application/json'
    };
    console.log(`config: ${JSON.stringify(config, null, 2)}`);

    let signedRequest = this.apiGatewayService.signRequest(request, config);
    console.log(`signedRequest: ${JSON.stringify(signedRequest, null, 2)}`);

    let httpHeaders = new HttpHeaders();
    for (let header in signedRequest.headers) {
      httpHeaders = httpHeaders.set(header, signedRequest.headers[header]);
    }

    let signedReq = req.clone({headers: httpHeaders});

    return next.handle(signedReq);
  }

}
