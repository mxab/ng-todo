import { Component, OnInit } from '@angular/core';
import { StatusFilter, TodoService } from '../todo.service';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
import {
  catchError,
  map,
  scan,
  startWith,
  switchAll,
  tap,
} from 'rxjs/operators';
import { Todo } from '../todo';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  constructor(
    private todoService: TodoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  filter = this.fb.group({
    status: this.fb.control(this.route.snapshot.paramMap.get('status')),
  });

  load$ = new BehaviorSubject<void>(undefined);

  filter$: Observable<{ status: StatusFilter }> = this.filter.valueChanges.pipe(
    startWith(this.filter.value)
  );

  todoState$: Observable<{
    todos: Todo[];
    error?: string;
    loading: boolean;
  }> = combineLatest([this.route.paramMap, this.load$]).pipe(
    scan((agg, [params, ...others]) => {
      let statusFilter = (params.get('status') || '') as StatusFilter;
      return this.todoService
        .findAll({
          status: statusFilter,
        })
        .pipe(
          tap((v) => {
            this.filter.reset({ status: statusFilter });
          }),
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

  async applyFilter() {
    await this.router.navigate([this.filter.value]);
  }

  async complete(index: number) {
    await this.todoService.complete(index).toPromise();
    this.load$.next();
  }
}
