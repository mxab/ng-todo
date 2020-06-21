import { Component } from '@angular/core';
import { TodoService } from './todo.service';
import { catchError, map, scan, switchAll, tap } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { Todo } from './todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ng-todo';

  load$ = new BehaviorSubject<void>(undefined);

  todos$ = this.todoService.findAll().pipe(
    map((todos) => {
      return {
        todos,
        error: null,
      };
    }),
    catchError((e) => {
      return of({
        todos: [],
        error: e.toString(),
      });
    })
  );
  todoState$: Observable<{
    todos: Todo[];
    error?: string;
  }> = this.load$.pipe(
    scan((agg, unused) => {
      return this.todos$;
    }, EMPTY),
    switchAll()
  );

  constructor(private todoService: TodoService) {}

  async complete(index: number) {
    await this.todoService.complete(index).toPromise();
    this.load$.next();
  }
}
