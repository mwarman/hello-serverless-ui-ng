import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';

import { Greeting } from './greeting';
import { GREETINGS } from './mock-greetings';

@Injectable()
export class GreetingService {

  private recentGreetings: Greeting[] = [];

  constructor() { }

  getGreetings(): Observable<Greeting[]> {
    return of(GREETINGS);
  }

  getGreeting(id: string): Observable<Greeting> {
    let greeting = GREETINGS.find(greeting => greeting.id === id);
    this.addRecent(greeting);
    return of(GREETINGS.find(greeting => greeting.id === id));
  }

  getRecent(): Greeting[] {
    return this.recentGreetings;
  }

  private addRecent(greeting): void {
    this.removeRecent(greeting.id);
    this.recentGreetings = this.recentGreetings.slice(0, 1);
    this.recentGreetings.unshift(greeting);
  }

  private removeRecent(id: string): void {
    this.recentGreetings = this.recentGreetings.filter(greeting => greeting.id !== id);
  }

}
