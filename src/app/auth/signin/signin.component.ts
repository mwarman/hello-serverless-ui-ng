import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  busy: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.refreshSession();
  }

  signin(username: string, password: string): void {
    this.busy = true;
    this.authService.signIn(username, password).subscribe((result) => {
      console.log(`- SigninComponent.signin result: ${JSON.stringify(result, null, 2)}`);
      this.busy = false;
      this.router.navigate(['/']);
    });
  }

  refreshSession(): void {
    this.busy = true;
    this.authService.getSession().subscribe((result) => {
      if (result.success) {
        console.log(`- SigninComponent.refreshSession result: ${JSON.stringify(result, null, 2)}`);
        this.router.navigate(['/']);
      } else {
        this.busy = false;
      }
    });
  }

}
