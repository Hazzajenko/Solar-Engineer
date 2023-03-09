import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { ProjectsHubActions, ProjectsHubService, StringsActions, StringsService } from '../'
import { ProjectsActions, ProjectsStoreService } from '@projects/data-access'
import { map } from 'rxjs'
import { StringsSignalrService } from '../api/strings/strings-signalr.service'
import { getGuid } from '@shared/utils'
import {
  ProjectEventAction,
  ProjectItemType,
  ProjectSignalrJsonRequest,
} from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class StringsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)

  private stringsService = inject(StringsService)
  private stringsSignalrService = inject(StringsSignalrService)
  private projectsStore = inject(ProjectsStoreService)
  private projectsHubService = inject(ProjectsHubService)
  /*  initStrings$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProjectsActions.initSelectProject),
        switchMap(({ projectId }) =>
          this.stringsService.getStringsByProjectId(projectId).pipe(
            map((strings) => StringsActions.loadStringsSuccess({ strings })),
            catchError((error) => of(StringsActions.loadStringsFailure({ error: error.message }))),
          ),
        ),
      ),
    )*/

  /* loadStringsSuccess$ = createEffect(() =>
     this.actions$.pipe(
       ofType(StringsActions.loadStringsSuccess),
       map(({ strings }) => EntitiesActions.addManyEntitiesForGrid({ entities: strings })),
     ),
   )
 */
  initLocalStrings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.initLocalProject),
      map(({ localProject }) =>
        StringsActions.loadStringsSuccess({ strings: localProject.strings }),
      ),
    ),
  )

  addStringSignalR$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StringsActions.addString),
        map(({ string }) => {
          const isSignalr = true
          if (!isSignalr) {
            return ProjectsHubActions.cancelSignalrRequest()
          }
          const action: ProjectEventAction = 'CREATE'
          const model: ProjectItemType = 'STRING'
          const projectSignalrEvent: ProjectSignalrJsonRequest = {
            action,
            model,
            projectId: string.projectId,
            requestId: getGuid(),
            data: JSON.stringify(string),
          }
          this.projectsHubService.sendJsonSignalrRequest(projectSignalrEvent)
          return
          /*          const request: CreateStringRequest = {
                      requestId: getGuid(),
                      projectId: string.projectId,
                      create: {
                        id: string.id,
                        projectId: string.projectId,
                        name: string.name,
                      },
                      // name: string.name,
                    }
                    this.projectsHubService.sendSignalrRequest(request, 'STRING', 'CREATE')
                    // request = this.projectsHubService.createSignalrRequest(request, 'STRING', 'CREATE')

                    return this.stringsSignalrService.addStringSignalr(request)*/
          // return ProjectsHubActions.sendSignalrRequest({ signalrRequest: request })
        }),
      ),
    { dispatch: false },
  )

  /* addStringHttp$ = createEffect(
     () =>
       this.actions$.pipe(
         ofType(StringsActions.addString),
         switchMap(({ string }) =>
           this.projectsStore.select.selectIsWebProject$.pipe(
             switchMap((isWeb) => {
               if (isWeb) {
                 return this.stringsService.addString(string)
               }
               // update local state
               return of(undefined)
             }),
           ),
         ),
       ),
     { dispatch: false },
   )*/

  /*  deleteStringHttp$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(StringsActions.deleteString),
          switchMap(({ stringId }) =>
            this.projectsStore.select.isWebWithProject$.pipe(
              switchMap(([isWeb, project]) => {
                if (!project) return of(undefined)
                if (isWeb) {
                  return this.stringsService.deleteString(stringId, project.id)
                }
                // update local state
                return of(undefined)
              }),
            ),
          ),
        ),
      { dispatch: false },
    )*/
}
