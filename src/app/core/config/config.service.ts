import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { CONFIG } from './config';

@Injectable()
export class ConfigService {

  private configUrl = 'config.json';
  private config: Object = {};

  constructor(
    private http: HttpClient
  ) {}

  getProperty(key: string): string {
    let val = this.config[key];
    console.log(`- ConfigService.getProperty(${key}) val: ${val}`);
    return val;
  }

  load(): void {
    this.config = CONFIG;
    console.log(`> load config. local config: ${JSON.stringify(this.config, null, 2)}`);
    //TODO Load remote config.json
    this.loadRemote().subscribe((remoteConfig) => {
      this.config = Object.assign(this.config, remoteConfig);
      console.log(`- final config: ${JSON.stringify(this.config, null, 2)}`);
    });
  }

  private loadRemote(): Observable<any> {
    return this.http.get<any>(this.configUrl).pipe(
      tap(config => console.log(`- remote config: ${JSON.stringify(config, null, 2)}`)),
      catchError(this.handleError('loadRemote', {}))
    );
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
      console.warn(`Unable to load remote configuration. function: ${operation}`);
      console.warn(error, error.stack); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
