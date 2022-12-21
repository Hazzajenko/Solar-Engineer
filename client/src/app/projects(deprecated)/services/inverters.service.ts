import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { InverterModel } from '../models/deprecated-for-now/inverter.model'
import {
  addInverter,
  addInvertersByProjectId,
  deleteInverter,
} from '../store(deprecated)/inverters/inverters.actions'

interface InvertersEnvelope {
  inverters: InverterModel[]
}

interface InverterEnvelope {
  inverter: InverterModel
}

@Injectable({
  providedIn: 'root',
})
export class InvertersService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  getInvertersByProjectId(projectId: number): Promise<InvertersEnvelope> {
    return new Promise<InvertersEnvelope>((resolve, reject) =>
      this.http
        .get<InvertersEnvelope>(environment.apiUrl + `/projects/${projectId}`)
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(
              addInvertersByProjectId({ inverters: envelope.inverters }),
            )
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('getInvertersByProjectId')
          },
        }),
    )
  }

  createInverterByProjectId(projectId: number): Promise<InverterEnvelope> {
    return new Promise<InverterEnvelope>((resolve, reject) =>
      this.http
        .post<InverterEnvelope>(environment.apiUrl + `/projects/${projectId}`, {
          name: 'yes',
        })
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(addInverter({ inverter: envelope.inverter }))
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('createInverterByProjectId')
          },
        }),
    )
  }

  deleteInverter(
    projectId: number,
    inverterId: number,
  ): Promise<InverterEnvelope> {
    return new Promise<InverterEnvelope>((resolve, reject) =>
      this.http
        .delete<InverterEnvelope>(
          `${environment.apiUrl}/projects/${projectId}/inverters`,
          {
            body: {
              id: inverterId,
            },
          },
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(deleteInverter({ inverterId }))
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('deleteInverter')
          },
        }),
    )
  }
}
