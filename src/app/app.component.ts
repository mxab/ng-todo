import { Component } from '@angular/core';
import { StatusFilter, TodoService } from './todo.service';
import { catchError, map, scan, startWith, switchAll } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
import { Todo } from './todo';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ng-todo';

  filter = this.fb.group({
    status: this.fb.control(StatusFilter.all),
  });

  load$ = new BehaviorSubject<void>(undefined);

  filter$: Observable<{ status: StatusFilter }> = this.filter.valueChanges.pipe(
    startWith(this.filter.value)
  );

  todoState$: Observable<{
    todos: Todo[];
    error?: string;
    loading: boolean;
  }> = combineLatest([this.filter$, this.load$]).pipe(
    scan((agg, [filter, ...others]) => {
      return this.todoService.findAll(filter).pipe(
        map((todos) => {
          return {
            todos,
            loading: false,
            error: null,
          };
        }),
        catchError((e) => {
          return of({
            todos: [],
            loading: false,
            error: e.toString(),
          });
        }),
        startWith({
          todos: [],
          loading: true,
          error: null,
        })
      );
    }, EMPTY),
    switchAll()
  );

  constructor(private todoService: TodoService, private fb: FormBuilder) {}

  async complete(index: number) {
    await this.todoService.complete(index).toPromise();
    this.load$.next();
  }
}
