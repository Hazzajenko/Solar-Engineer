import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../../../environments/environment'
import { map } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
import { RailModel } from '../../../../models/rail.model'

interface GetRailsResponse {
  rails: RailModel[]
}

interface UpdateRailResponse {
  rail: RailModel
}

interface CreateRailResponse {
  rail: RailModel
}

interface DeleteRailResponse {
  rail_id: number
}

@Injectable()
export class RailsDataService extends DefaultDataService<RailModel> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Rail', http, httpUrlGenerator)
  }

  override getAll(): Observable<RailModel[]> {
    return this.http
      .get<GetRailsResponse>(environment.apiUrl + `/projects/3/rails`)
      .pipe(map((res) => res.rails))
  }

  override add(entity: RailModel): Observable<RailModel> {
    return this.http
      .post<CreateRailResponse>(environment.apiUrl + `/projects/3/rail`, entity)
      .pipe(map((res) => res.rail))
  }

  override update(update: Update<RailModel>): Observable<RailModel> {
    return this.http
      .put<UpdateRailResponse>(
        environment.apiUrl + `/projects/3/rail/${update.id}`,
        update,
      )
      .pipe(map((res) => res.rail))
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeleteRailResponse>(
        environment.apiUrl + `/projects/3/rail/${key}`,
      )
      .pipe(map((res) => res.rail_id))
  }
}
