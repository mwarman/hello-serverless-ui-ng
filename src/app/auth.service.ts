import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { catchError, map, flatMap, tap } from 'rxjs/operators';

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
      } else {
        callback(result);
      }
    });
  }

  signout(): Observable<any> {
    console.log(`signout`);
    let signoutObservable = Observable.bindCallback(this.signoutWithCallback);
    return signoutObservable(this.cognitoUser).pipe(
      tap((result) => {
        console.log(`signout success`);
        this.authenticated = false;
        this.authenticationDetails = undefined;
        this.cognitoUser = undefined;
        this.credentials = undefined;
        AWS.config.credentials = undefined;
      }),
      catchError(this.handleError('signout', {}))
    );
  }

  private signoutWithCallback(cognitoUser: CognitoUser, callback: Function): void {
    console.log(`signoutWithCallback`);
    try {
      if (cognitoUser) {
        cognitoUser.signOut();
      }
      callback({});
    } catch (err) {
      throw err;
    }
  }

  signIn(username: string, password: string): Observable<any> {
    console.log(`> AuthService.signIn`);
    this.authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });
    this.cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool
    });

    let signInObservable = Observable.bindCallback(this.signInWithCallback);
    return signInObservable(this.cognitoUser, this.authenticationDetails).pipe(
      tap((result: any) => {
        this.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-east-1:dd021fcb-aa73-4ffb-9194-643f7c0c406e',
          Logins: {
            ['cognito-idp.us-east-1.amazonaws.com/us-east-1_fQSDwKQMK']: result.getIdToken().getJwtToken()
          }
        });
        AWS.config.credentials = this.credentials;
      }),
      flatMap((result) => this.refreshCredentials()),
      catchError(this.handleError('signIn', {}))
    );
  }

  private signInWithCallback(cognitoUser: CognitoUser, authenticationDetails: AuthenticationDetails, callback: Function): void {
    console.log(`> AuthService.signInWithCallback`);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log(`Cognito authentication successful. result: ${JSON.stringify(result, null, 2)}`);
        callback(result);
      },
      onFailure: (err) => {
        throw err;
      }
    });
  }

  refreshCredentials(): Observable<any> {
    console.log(` AuthService.refreshCredentials`);
    let refreshCredentialsObservable = Observable.bindCallback(this.refreshCredentialsWithCallback);
    return refreshCredentialsObservable(this.credentials).pipe(
      tap((result) => this.authenticated = true),
      catchError(this.handleError('refreshCredentials', {}))
    );
  }

  private refreshCredentialsWithCallback(credentials: AWS.CognitoIdentityCredentials, callback: Function): void {
    console.log(`> AuthService.refreshCredentialsWithCallback`);
    credentials.refresh((error) => {
      if (error) {
        throw error;
      } else {
        AWS.config.credentials = credentials;
        console.log('Successfully obtained temporary credentials.');
        console.log(`    Access Key ID: ${AWS.config.credentials.accessKeyId}`);
        console.log(`Secret Access Key: ${AWS.config.credentials.secretAccessKey}`);
        console.log(`    Session Token: ${AWS.config.credentials.sessionToken}`);
        callback({});
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
