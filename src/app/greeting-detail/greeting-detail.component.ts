import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { GreetingService } from '../greeting.service';
import { Greeting } from '../greeting';

@Component({
  selector: 'app-greeting-detail',
  templateUrl: './greeting-detail.component.html',
  styleUrls: ['./greeting-detail.component.css']
})
export class GreetingDetailComponent implements OnInit {

  greeting: Greeting;

  constructor(
    private route: ActivatedRoute,
    private greetingService: GreetingService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getGreeting();
  }

  getGreeting(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.greetingService.getGreeting(id)
      .subscribe(greeting => this.greeting = greeting);
  }

  goBack(): void {
    this.location.back();
  }
}
