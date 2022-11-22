import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../../environments/environment'
import { map } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
import { CableModel } from '../../../models/cable.model'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'

interface GetCablesResponse {
  cables: CableModel[]
}

interface UpdateCableResponse {
  cable: CableModel
}

interface CreateCableResponse {
  cable: CableModel
}

interface DeleteCableResponse {
  cable_id: number
}

@Injectable()
export class CablesDataService extends DefaultDataService<CableModel> {
  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    private store: Store<AppState>,
  ) {
    super('Cable', http, httpUrlGenerator)
  }

  override getAll(): Observable<CableModel[]> {
    return this.http
      .get<GetCablesResponse>(environment.apiUrl + `/projects/3/cables`)
      .pipe(map((res) => res.cables))
  }

  override add(entity: CableModel): Observable<CableModel> {
    return this.http
      .post<CreateCableResponse>(
        environment.apiUrl + `/projects/3/cable`,
        entity,
      )
      .pipe(map((res) => res.cable))
  }

  override update(update: Update<CableModel>): Observable<CableModel> {
    // update.
    // const id = Number(update.id
    console.log(update)
    return this.http
      .put<UpdateCableResponse>(
        environment.apiUrl + `/projects/3/cable/${update.id}`,
        update,
      )
      .pipe(map((res) => res.cable))
    // return super.update(update)
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeleteCableResponse>(
        environment.apiUrl + `/projects/3/cable/${key}`,
      )
      .pipe(map((res) => res.cable_id))
  }
}
