import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Todo } from './todo';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  db: Todo[] = [
    {
      name: 'Buy milk',
      done: true,
    },
    {
      name: 'Bake cake',
      done: false,
    },
  ];

  constructor() {}

  public findAll(): Observable<Todo[]> {
    return throwError(new Error('Something went wrong'));
    // return of(this.db).pipe(delay(2000));
  }
}
