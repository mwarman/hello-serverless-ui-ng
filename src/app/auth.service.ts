import { Injectable } from '@angular/core';

import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';

AWS.config.region = 'us-east-1';

@Injectable()
export class AuthService {

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

  signIn(username: string, password: string) {
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

}
