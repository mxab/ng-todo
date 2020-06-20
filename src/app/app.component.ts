import { Component } from '@angular/core';
import { TodoService } from './todo.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Todo } from './todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ng-todo';

  todoState$: Observable<{
    todos: Todo[];
    error?: string;
  }> = this.todoService.findAll().pipe(
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

  constructor(private todoService: TodoService) {}

  complete(index: number) {
    this.todoService.complete(index);
  }
}
