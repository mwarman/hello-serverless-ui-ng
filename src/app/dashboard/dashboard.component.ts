import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GreetingService } from '../greeting/greeting.service';
import { Greeting } from '../greeting/greeting';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  busy: boolean = false;

  greetings: Greeting[];
  recent: Greeting[];

  constructor(
    private greetingService: GreetingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.busy = false;
    this.getGreetings();
  }

  getGreetings(): void {
    this.busy = true;
    this.recent = this.greetingService.getRecent();
    this.greetingService.getGreetings()
      .subscribe(greetings => {
        this.greetings = greetings;
        this.busy = false;
      });
  }

  view(id: string): void {
    this.router.navigate(['/greetings', id]);
  }

}
