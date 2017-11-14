import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  signin(username: string, password: string): void {
    this.authService.signIn(username, password).subscribe((result) => {
      console.log(`- SigninComponent.signin result: ${JSON.stringify(result, null, 2)}`);
      this.router.navigate(['/']);
    });;
  }

}
