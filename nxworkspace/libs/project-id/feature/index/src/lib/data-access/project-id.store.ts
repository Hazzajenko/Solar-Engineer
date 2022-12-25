import { inject, Injectable } from '@angular/core'
import { AuthService, SignInRequest } from '@auth/data-access/api'
import { AuthActions } from '@auth/data-access/store'
import { ComponentStore } from '@ngrx/component-store'
import { Store } from '@ngrx/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { ProjectModel } from '@shared/data-access/models'
import { AppState } from '@shared/data-access/store'
import { Observable, of, switchMap, tap } from 'rxjs'
import { map } from 'rxjs/operators'

interface ProjectState {
  project?: ProjectModel
}

@Injectable({
  providedIn: 'root',
})
export class ProjectIdStore extends ComponentStore<ProjectState> {
  private authService = inject(AuthService)
  private projects = inject(ProjectsFacade)
  readonly project$ = this.select((state) => state.project).pipe(
    switchMap((project) => {
      if (project) {
        return of(project)
      }
      return this.projects.projectFromRoute$.pipe(
        tap((project) => {
          this.patchState({ project })
        }),
      )
    }),
  )
  private store = inject(Store<AppState>)
  readonly signIn = this.effect((signInRequest$: Observable<SignInRequest>) =>
    signInRequest$.pipe(
      map((params) => params),
      switchMap((req) =>
        this.authService.signIn(req).pipe(
          tap((user) => {
            this.store.dispatch(AuthActions.addUserAndToken({ user, token: user.token }))
          }),
        ),
      ),
    ),
  )

  constructor() {
    super({
      project: undefined,
    })
  }
}
