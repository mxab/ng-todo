import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo } from './todo';

export enum StatusFilter {
  open = 'open',
  done = 'done',
  all = '',
}

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

  public findAll(filter: { status: StatusFilter }): Observable<Todo[]> {
    return new Observable((subscriber) => {
      console.log('Loading....', filter);
      setTimeout(() => {
        const values = this.cloneDB().filter((todo) => {
          if (filter.status === StatusFilter.all) {
            return true;
          } else if (filter.status === StatusFilter.done && todo.done) {
            return true;
          } else if (filter.status === StatusFilter.open && !todo.done) {
            return true;
          }
          return false;
        });

        subscriber.next(values);
        subscriber.complete();
      }, 800);
    });
  }

  private cloneDB(): Todo[] {
    return JSON.parse(JSON.stringify(this.db));
  }

  complete(i: number): Observable<Todo> {
    this.db[i].done = true;
    return of(this.cloneDB()[i]);
  }
}
