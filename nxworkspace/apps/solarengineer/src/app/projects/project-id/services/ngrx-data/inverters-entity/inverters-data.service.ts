import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../../../environments/environment'
import { map } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
import { InverterModel } from '../../../../models/deprecated-for-now/inverter.model'

interface GetInvertersResponse {
  inverters: InverterModel[]
}

interface UpdateInverterResponse {
  inverter: InverterModel
}

interface CreateInverterResponse {
  inverter: InverterModel
}

interface DeleteInverterResponse {
  inverter_id: number
}

@Injectable()
export class InvertersDataService extends DefaultDataService<InverterModel> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Inverter', http, httpUrlGenerator)
  }

  override getAll(): Observable<InverterModel[]> {
    return this.http
      .get<GetInvertersResponse>(environment.apiUrl + `/projects/3/inverters`)
      .pipe(map((res) => res.inverters))
  }

  override add(entity: InverterModel): Observable<InverterModel> {
    return this.http
      .post<CreateInverterResponse>(environment.apiUrl + `/projects/3/inverter`, entity)
      .pipe(map((res) => res.inverter))
  }

  override update(update: Update<InverterModel>): Observable<InverterModel> {
    console.log(update)
    return this.http
      .put<UpdateInverterResponse>(environment.apiUrl + `/projects/3/inverter/${update.id}`, update)
      .pipe(map((res) => res.inverter))
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeleteInverterResponse>(environment.apiUrl + `/projects/3/inverter/${key}`)
      .pipe(map((res) => res.inverter_id))
  }
}
