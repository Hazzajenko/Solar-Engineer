import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, switchMap } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
import { StringModel } from '../../../../models/string.model'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { selectCurrentProjectId } from '../../store/projects/projects.selectors'

interface GetStringsResponse {
  strings: StringModel[]
}

interface UpdateStringResponse {
  string: StringModel
}

interface CreateStringResponse {
  string: StringModel
}

interface DeleteStringResponse {
  string_id: number
}

@Injectable()
export class StringsDataService extends DefaultDataService<StringModel> {
  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    private store: Store<AppState>, // logger: Logger,
  ) {
    super('String', http, httpUrlGenerator)
    // logger.log('Created custom Strings EntityDataService')
  }

  override getAll(): Observable<StringModel[]> {
    return this.store.select(selectCurrentProjectId).pipe(
      take(1),
      switchMap((projectId) =>
        this.http
          .get<GetStringsResponse>(`/api/projects/${projectId}/strings`)
          .pipe(map((res) => res.strings)),
      ),
      /*        switchMap((project) =>
                  this.http
                    .get<GetStringsResponse>(`/api/projects(deprecated)/${project?.id}/strings`)
                    .pipe(map((res) => res.strings)),
                ),*/
    )
  }

  override add(entity: StringModel): Observable<StringModel> {
    return this.http
      .post<CreateStringResponse>(`/api/projects/1/string`, entity)
      .pipe(map((res) => res.string))
  }

  override update(update: Update<StringModel>): Observable<StringModel> {
    return this.http
      .put<UpdateStringResponse>(`/api/projects/1/string/${update.id}`, {
        ...update.changes,
      })
      .pipe(
        map((res) => {
          return res.string
        }),
      )
    /*    return this.http
          .put<UpdateStringResponse>(`/api/projects(deprecated)/1/string/${update.id}`, update)
          .pipe(map((res) => res.string))*/
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeleteStringResponse>(`/api/projects/1/string/${key}`)
      .pipe(map((res) => res.string_id))
  }
}
