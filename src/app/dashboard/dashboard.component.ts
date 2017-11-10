import { Component, OnInit } from '@angular/core';

import { GreetingService } from '../greeting.service';
import { Greeting } from '../greeting';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  greetings: Greeting[];
  recent: Greeting[];

  constructor(private greetingService: GreetingService) { }

  ngOnInit() {
    this.getGreetings();
  }

  getGreetings(): void {
    this.recent = this.greetingService.getRecent();
    this.greetingService.getGreetings()
      .subscribe(greetings => this.greetings = greetings);
  }

}
