import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.signout();
  }

  signout(): void {
    console.log(`> SignoutComponent.signout`);
    this.authService.signout().subscribe((result) => {
      console.log(`- SignoutComponent.signout result: ${JSON.stringify(result, null, 2)}`);
      this.router.navigate(['/']);
    });
  }

}
