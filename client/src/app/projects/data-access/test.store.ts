import { ComponentStore } from '@ngrx/component-store'
import { inject, Injectable } from '@angular/core'
import { Observable, of, switchMap, tap } from 'rxjs'
import { map } from 'rxjs/operators'


interface TestModel {
  id: string
}
interface TestState {
  test?: TestModel
  tests: TestModel[]
}

@Injectable()
export class TestsStore extends ComponentStore<TestState> {
  test$ = this.select((state) => state.test)
  private testsService = inject(TestsService)


  readonly userProjects$ = this.select((state) => state.userProjects).pipe(
    switchMap((userProjects) => {
      if (userProjects) {
        return of(userProjects)
      }
      return this.projectsService.getUserProjects().pipe(
        tap((res) => {
          this.patchState({ userProjects: res })
        }),
      )
    }),
  )
  readonly getTestById = this.effect((testId$: Observable<string>) =>
    testId$.pipe(
      map((params) => params),
      switchMap((req) => this.testsService.getTestById(req).pipe(
        tap(res => this.patchState({test: res}))
      )),
    ),
  )

  constructor() {
    super({
      tests: [],
      test: undefined,
    })
  }
}
