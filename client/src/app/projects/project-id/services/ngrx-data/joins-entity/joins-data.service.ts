import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../../../environments/environment'
import { map } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
import { JoinModel } from '../../../../models/join.model'

interface GetJoinsResponse {
  joins: JoinModel[]
}

interface UpdateJoinResponse {
  join: JoinModel
}

interface CreateJoinResponse {
  join: JoinModel
}

interface DeleteJoinResponse {
  join_id: number
}

@Injectable()
export class JoinsDataService extends DefaultDataService<JoinModel> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Join', http, httpUrlGenerator)
  }

  override getAll(): Observable<JoinModel[]> {
    return this.http
      .get<GetJoinsResponse>(environment.apiUrl + `/projects/3/joins`)
      .pipe(map((res) => res.joins))
  }

  override add(entity: JoinModel): Observable<JoinModel> {
    return this.http
      .post<CreateJoinResponse>(environment.apiUrl + `/projects/3/join`, entity)
      .pipe(map((res) => res.join))
  }

  override update(update: Update<JoinModel>): Observable<JoinModel> {
    console.log(update)
    return this.http
      .put<UpdateJoinResponse>(
        environment.apiUrl + `/projects/3/join/${update.id}`,
        update,
      )
      .pipe(map((res) => res.join))
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeleteJoinResponse>(
        environment.apiUrl + `/projects/3/join/${key}`,
      )
      .pipe(map((res) => res.join_id))
  }
}
