import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GreetingService } from '../greeting.service';
import { Greeting } from '../greeting';

@Component({
  selector: 'app-greeting-list',
  templateUrl: './greeting-list.component.html',
  styleUrls: ['./greeting-list.component.css']
})
export class GreetingListComponent implements OnInit {

  busyLoading: boolean = false;
  busyAdding: boolean = false;

  greetings: Greeting[];

  constructor(
    private greetingService: GreetingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getGreetings();
  }

  getGreetings(): void {
    this.busyLoading = true;
    this.greetingService.getGreetings()
      .subscribe(greetings => {
        this.greetings = greetings;
        this.busyLoading = false;
        // console.log(`GreetingListComponent greetings: ${JSON.stringify(this.greetings, null, 2)}`);
      });
  }

  view(id: string): void {
    this.router.navigate(['/greetings', id]);
  }

  add(value: string, author: string): void {
    value = value.trim();
    author = author.trim();
    if (!value || !author) {
      return;
    }
    this.busyAdding = true;
    this.greetingService.addGreeting({value,author} as Greeting)
      .subscribe(greeting => {
        this.greetings.push(greeting);
        this.busyAdding = false;
      });
  }

  delete(greeting: Greeting): void {
    this.busyLoading = true;
    this.greetingService.deleteGreeting(greeting)
      .subscribe(deletedGreeting => {
        this.greetings = this.greetings.filter(g => g.id !== greeting.id);
        this.busyLoading = false;
      });
  }

}
