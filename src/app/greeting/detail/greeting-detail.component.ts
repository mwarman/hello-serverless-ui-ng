import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import * as _ from 'lodash';

import { GreetingService } from '../greeting.service';
import { Greeting } from '../greeting';

@Component({
  selector: 'app-greeting-detail',
  templateUrl: './greeting-detail.component.html',
  styleUrls: ['./greeting-detail.component.css']
})
export class GreetingDetailComponent implements OnInit {

  busyLoading: boolean = false;
  busyUpdating: boolean = false;

  mode: string = 'view';
  greeting: Greeting;
  editingGreeting: Greeting;

  constructor(
    private route: ActivatedRoute,
    private greetingService: GreetingService,
    private location: Location
  ) { }

  ngOnInit() {
    this.mode = 'view';
    this.getGreeting();
  }

  getGreeting(): void {
    this.busyLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.greetingService.getGreeting(id)
      .subscribe(greeting => {
        this.greeting = greeting;
        this.busyLoading = false;
      });
  }

  view(): void {
    this.mode = 'view';
  }

  edit(): void {
    this.editingGreeting = _.clone(this.greeting);
    this.mode = 'edit';
  }

  save(): void {
    this.busyUpdating = true;
    this.greetingService.updateGreeting(this.editingGreeting)
      .subscribe(() => {
        this.busyUpdating = false;
        this.goBack();
      });
  }

  goBack(): void {
    this.location.back();
  }
}
