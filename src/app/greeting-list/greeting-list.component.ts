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
        // console.log(`GreetingListComponent greetings: ${JSON.stringify(this.greetings, null, 2)}`);
      });
  }

  add(value: string, author: string): void {
    value = value.trim();
    author = author.trim();
    if (!value || !author) {
      return;
    }
    this.greetingService.addGreeting({value,author} as Greeting)
      .subscribe(greeting => {
        this.greetings.push(greeting);
      });
  }

  delete(greeting: Greeting): void {
    this.greetingService.deleteGreeting(greeting)
      .subscribe(deletedGreeting => {
        this.greetings = this.greetings.filter(g => g.id !== greeting.id);
      });
  }

}
