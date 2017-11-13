import { Component, OnInit } from '@angular/core';

import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  signin(username: string, password: string) {
    console.log(`signin - un:${username} pw:${password}`);
    this.authService.signIn(username, password);
    
    // AWS.config.region = 'us-east-1';
    //
    // const authenticationDetails = new AuthenticationDetails({
    //   Username: username,
    //   Password: password
    // });
    // const userPool = new CognitoUserPool({
    //   UserPoolId: 'us-east-1_fQSDwKQMK',
    //   ClientId: '2et2lh23olteluq6n9dr8n1qrd'
    // });
    // const cognitoUser = new CognitoUser({
    //   Username: username,
    //   Pool: userPool
    // });
    //
    // cognitoUser.authenticateUser(authenticationDetails, {
    //   onSuccess: (result) => {
    //     console.log(`Cognito authentication successful. result: ${JSON.stringify(result, null, 2)}`);
    //     let credentials = new AWS.CognitoIdentityCredentials({
    //       IdentityPoolId: 'us-east-1:dd021fcb-aa73-4ffb-9194-643f7c0c406e',
    //       Logins: {
    //         ['cognito-idp.us-east-1.amazonaws.com/us-east-1_fQSDwKQMK']: result.getIdToken().getJwtToken()
    //       }
    //     });
    //     AWS.config.credentials = credentials;
    //     console.log(`    Access Key ID: ${AWS.config.credentials.accessKeyId}`);
    //     console.log(`Secret Access Key: ${AWS.config.credentials.secretAccessKey}`);
    //     console.log(`    Session Token: ${AWS.config.credentials.sessionToken}`);
    //     credentials.refresh((error) => {
    //       if (error) {
    //         console.error(error);
    //       } else {
    //         console.log('Successfully obtained temporary credentials.');
    //         console.log(`    Access Key ID: ${AWS.config.credentials.accessKeyId}`);
    //         console.log(`Secret Access Key: ${AWS.config.credentials.secretAccessKey}`);
    //         console.log(`    Session Token: ${AWS.config.credentials.sessionToken}`);
    //       }
    //     });
    //   },
    //   onFailure: (err) => {
    //     console.log(`Cognito authentication failed.`);
    //     console.error(err, err.stack);
    //   }
    // });
  }

}
