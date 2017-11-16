import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { ConfigService } from '../core/config/config.service';
import { Greeting } from './greeting';

@Injectable()
export class GreetingService {

  private greetingsUrl = 'greetings';
  private recentGreetings: Greeting[] = [];

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getGreetings(): Observable<Greeting[]> {
    const baseUrl = this.configService.getProperty('greetingApiBaseUrl');
    const url = `${baseUrl}${this.greetingsUrl}`;

    return this.http.get<any>(url)
      .pipe(
        map(data => data.greetings as Greeting[]),
        tap(greetings => console.log(`fetched all (${greetings.length}) greetings`)),
        catchError(this.handleError('getGreetings', []))
      );
  }

  getGreeting(id: string): Observable<Greeting> {
    const baseUrl = this.configService.getProperty('greetingApiBaseUrl');
    const url = `${baseUrl}${this.greetingsUrl}/${id}`;

    return this.http.get<Greeting>(url).pipe(
      tap(greeting => {
        this.addRecent(greeting);
        console.log(`fetched greeting id:${greeting.id}`);
      }),
      catchError(this.handleError<Greeting>(`getGreeting id=${id}`))
    );
  }

  getRecent(): Greeting[] {
    return this.recentGreetings;
  }

  clearRecent(): void {
    this.recentGreetings = [];
  }

  updateGreeting(greeting: Greeting): Observable<Greeting> {
    const baseUrl = this.configService.getProperty('greetingApiBaseUrl');
    const url = `${baseUrl}${this.greetingsUrl}/${greeting.id}`;

    return this.http.put<Greeting>(url, greeting).pipe(
      tap(greeting => console.log(`updated greeting id:${greeting.id}`)),
      catchError(this.handleError<Greeting>('updateGreeting'))
    );
  }

  addGreeting(greeting: Greeting): Observable<Greeting> {
    const baseUrl = this.configService.getProperty('greetingApiBaseUrl');
    const url = `${baseUrl}${this.greetingsUrl}`;

    return this.http.post<Greeting>(url, greeting).pipe(
      tap(greeting => console.log(`added new greeting with id:${greeting.id}`)),
      catchError(this.handleError<Greeting>('addGreeting'))
    );
  }

  deleteGreeting(greeting: Greeting | number): Observable<Greeting> {
    const id = typeof greeting === 'number' ? greeting : greeting.id;
    const baseUrl = this.configService.getProperty('greetingApiBaseUrl');
    const url = `${baseUrl}${this.greetingsUrl}/${id}`;

    return this.http.delete<Greeting>(url).pipe(
      tap(greeting => {
        console.log(`deleted greeting id:${id}`);
        this.removeRecent(greeting.id);
      }),
      catchError(this.handleError<Greeting>('deleteGreeting'))
    );
  }

  private addRecent(greeting): void {
    this.removeRecent(greeting.id);
    this.recentGreetings = this.recentGreetings.slice(0, 1);
    this.recentGreetings.unshift(greeting);
  }

  private removeRecent(id: string): void {
    this.recentGreetings = this.recentGreetings.filter(greeting => greeting.id !== id);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(`handleError for operation: ${operation}`);
      console.error(error, error.stack); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
