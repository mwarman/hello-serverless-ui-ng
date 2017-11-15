import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  signup(username: string, password: string): void {
    console.log(`> SignupComponent.signup un:${username} pw:${password}`);
    this.authService.register(username, password).subscribe((result) => {
      console.log(`- SignupComponent.signup result: ${JSON.stringify(result, null, 2)}`);
      this.router.navigate(['/signup/confirm']);
    });
  }

}
