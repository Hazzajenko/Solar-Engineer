import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../../../environments/environment'
import { map } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
import { TrayModel } from '../../../../models/deprecated-for-now/tray.model'

interface GetTraysResponse {
  trays: TrayModel[]
}

interface UpdateTrayResponse {
  tray: TrayModel
}

interface CreateTrayResponse {
  tray: TrayModel
}

interface DeleteTrayResponse {
  tray_id: number
}

@Injectable()
export class TraysDataService extends DefaultDataService<TrayModel> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Tray', http, httpUrlGenerator)
  }

  override getAll(): Observable<TrayModel[]> {
    return this.http
      .get<GetTraysResponse>(environment.apiUrl + `/projects/3/trays`)
      .pipe(map((res) => res.trays))
  }

  override add(entity: TrayModel): Observable<TrayModel> {
    return this.http
      .post<CreateTrayResponse>(environment.apiUrl + `/projects/3/tray`, entity)
      .pipe(map((res) => res.tray))
  }

  override update(update: Update<TrayModel>): Observable<TrayModel> {
    return this.http
      .put<UpdateTrayResponse>(
        environment.apiUrl + `/projects/3/tray/${update.id}`,
        update,
      )
      .pipe(map((res) => res.tray))
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeleteTrayResponse>(
        environment.apiUrl + `/projects/3/tray/${key}`,
      )
      .pipe(map((res) => res.tray_id))
  }
}
