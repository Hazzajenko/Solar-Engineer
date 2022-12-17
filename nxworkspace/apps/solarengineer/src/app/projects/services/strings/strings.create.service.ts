import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { StringsEntityService } from '../../project-id/services/ngrx-data/strings-entity/strings-entity.service'

@Injectable({
  providedIn: 'root',
})
export class StringsCreateService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private stringsEntity: StringsEntityService,
  ) {}

  /*
    updateCable(request: UpdateCableRequest) {
      // console.log('update', request)
      return this.http.patch<UpdateCableResponse>(
        `${environment.apiUrl}/projects/${request.project_id}/cables`,
        {
          id: request.cable.id,
          location: request.newLocation,
          size: request.cable.size,
          color: request.cable.color,
        },
      )
    }
  */

  /*  addString(request: CreateCableRequest) {
      return this.http.post<CreateCableResponse>(
        `${environment.apiUrl}/projects/${request.project_id}/cables`,
        {
          location: request.location,
          size: request.size,
        },
      )
    }*/
}
