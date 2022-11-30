import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
import { DisconnectionPointModel } from '../../../../models/disconnection-point.model'

interface GetDisconnectionPointsResponse {
  disconnection_points: DisconnectionPointModel[]
}

interface UpdateDisconnectionPointResponse {
  disconnection_point: DisconnectionPointModel
}

interface CreateDisconnectionPointResponse {
  disconnection_point: DisconnectionPointModel
}

interface DeleteDisconnectionPointResponse {
  disconnection_point_id: number
}

@Injectable()
export class DisconnectionPointsDataService extends DefaultDataService<DisconnectionPointModel> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('DisconnectionPoint', http, httpUrlGenerator)
  }

  override getAll(): Observable<DisconnectionPointModel[]> {
    return this.http
      .get<GetDisconnectionPointsResponse>(
        `/api/projects/3/disconnection-points`,
      )
      .pipe(map((res) => res.disconnection_points))
  }

  override add(
    entity: DisconnectionPointModel,
  ): Observable<DisconnectionPointModel> {
    return this.http
      .post<CreateDisconnectionPointResponse>(
        `/api/projects/3/disconnection-point`,
        entity,
      )
      .pipe(map((res) => res.disconnection_point))
  }

  override update(
    update: Update<DisconnectionPointModel>,
  ): Observable<DisconnectionPointModel> {
    console.log(update)
    return this.http
      .put<UpdateDisconnectionPointResponse>(
        `/api/projects/3/disconnection-point/${update.id}`,
        update,
      )
      .pipe(map((res) => res.disconnection_point))
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeleteDisconnectionPointResponse>(
        `/api/projects/3/disconnection-point/${key}`,
      )
      .pipe(map((res) => res.disconnection_point_id))
  }
}
