import { Component, OnInit } from '@angular/core';

import { GreetingService } from '../greeting.service';
import { Greeting } from '../greeting';

@Component({
  selector: 'app-greeting-list',
  templateUrl: './greeting-list.component.html',
  styleUrls: ['./greeting-list.component.css']
})
export class GreetingListComponent implements OnInit {

  greetings: Greeting[];

  constructor(private greetingService: GreetingService) { }

  ngOnInit() {
    this.getGreetings();
  }

  getGreetings(): void {
    this.greetingService.getGreetings()
      .subscribe(greetings => {
        this.greetings = greetings;
        console.log(`GreetingListComponent greetings: ${JSON.stringify(this.greetings, null, 2)}`);
      });
  }

}
