import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
    return new Observable((subscriber) => {
      setTimeout(() => {
        subscriber.next(this.cloneDB());
        subscriber.complete();
      }, 2000);
    });
  }

  private cloneDB() {
    return JSON.parse(JSON.stringify(this.db));
  }

  complete(i: number): Observable<Todo> {
    this.db[i].done = true;
    return of(this.db[i]);
  }
}
