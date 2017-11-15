import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  busy: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.busy = false;
  }

  signup(username: string, password: string): void {
    console.log(`> SignupComponent.signup un:${username} pw:${password}`);
    this.busy = true;
    this.authService.register(username, password).subscribe((result) => {
      console.log(`- SignupComponent.signup result: ${JSON.stringify(result, null, 2)}`);
      this.busy = false;
      this.router.navigate(['/signup/confirm']);
    });
  }

}
