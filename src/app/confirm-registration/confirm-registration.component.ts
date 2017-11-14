import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.css']
})
export class ConfirmRegistrationComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  confirm(code: string): void {
    console.log(`> SignupComponent.confirm code:${code}`);
    this.authService.confirmRegistration(code).subscribe((result) => {
      console.log(`- ConfirmRegistrationComponent.signup result: ${JSON.stringify(result, null, 2)}`);
      this.router.navigate(['/dashboard']);
    });
  }

}
