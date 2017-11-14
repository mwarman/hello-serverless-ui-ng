import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';

AWS.config.region = 'us-east-1';

@Injectable()
export class AuthService {

  redirectUrl: string = '/';

  // TODO Obtain from Config
  private userPoolId = 'us-east-1_fQSDwKQMK';
  private clientId = '2et2lh23olteluq6n9dr8n1qrd';
  private identityPoolId = 'us-east-1:dd021fcb-aa73-4ffb-9194-643f7c0c406e';

  private authenticated: boolean = false;

  private authenticationDetails: AuthenticationDetails;
  private userPool: CognitoUserPool = new CognitoUserPool({
    UserPoolId: this.userPoolId,
    ClientId: this.clientId
  });
  private cognitoUser: CognitoUser;
  private credentials: AWS.CognitoIdentityCredentials;

  constructor() { }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  register(username: string, password: string): Observable<any> {
    console.log(`register un:${username} pw:${password}`);
    let registerObservable = Observable.bindCallback(this.registerWithCallback);
    return registerObservable(username, password, this.userPool).pipe(
      tap((result) => {
        console.log(`register result: ${JSON.stringify(result, null, 2)}`);
        this.cognitoUser = new CognitoUser({
          Username: username,
          Pool: this.userPool
        })
      }),
      catchError(this.handleError('register', {}))
    )
  }

  private registerWithCallback(username: string, password: string, pool: CognitoUserPool, callback: Function): void {
    console.log(`registerWithCallback`);
    pool.signUp(username, password, [], null, (err, result) => {
      if (err) {
        throw err;
      } else {
        callback(result);
      }
    });
  }

  confirmRegistration(code: string): Observable<any> {
    console.log(`confirmRegistration code:${code}`);
    let confirmObservable = Observable.bindCallback(this.confirmRegistrationWithCallback);
    return confirmObservable(code, this.cognitoUser).pipe(
      tap((result) => {
        console.log(`confirmRegistration result: ${JSON.stringify(result, null, 2)}`);
      }),
      catchError(this.handleError('confirmRegistration', {}))
    );
  }
  private confirmRegistrationWithCallback(code: string, cognitoUser: CognitoUser, callback: Function): void {
    console.log(`confirmRegistrationWithCallback code:${code}`);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        throw err;
      }else {
        callback(result);
      }
    });
  }

  signIn(username: string, password: string): void {
    this.authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });
    this.cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool
    });

    this.cognitoUser.authenticateUser(this.authenticationDetails, {
      onSuccess: (result) => {
        console.log(`Cognito authentication successful. result: ${JSON.stringify(result, null, 2)}`);
        this.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-east-1:dd021fcb-aa73-4ffb-9194-643f7c0c406e',
          Logins: {
            ['cognito-idp.us-east-1.amazonaws.com/us-east-1_fQSDwKQMK']: result.getIdToken().getJwtToken()
          }
        });
        AWS.config.credentials = this.credentials;

        this.refreshCredentials();
      },
      onFailure: (err) => {
        console.error(`Cognito authentication failed.`);
        console.error(err, err.stack);
      }
    });
  }

  private refreshCredentials(): void {
    this.credentials.refresh((error) => {
      if (error) {
        console.error('Cognito Identity credentials refresh failed.');
        console.error(error);
      } else {
        AWS.config.credentials = this.credentials;
        this.authenticated = true;
        console.log('Successfully obtained temporary credentials.');
        console.log(`    Access Key ID: ${AWS.config.credentials.accessKeyId}`);
        console.log(`Secret Access Key: ${AWS.config.credentials.secretAccessKey}`);
        console.log(`    Session Token: ${AWS.config.credentials.sessionToken}`);
      }
    });
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(`handleError for operation: ${operation}`);
      console.error(error, error.stack); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
