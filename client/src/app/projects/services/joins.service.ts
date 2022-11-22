import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { CableModel } from '../models/cable.model'
import { CablesEntityService } from '../project-id/services/cables-entity/cables-entity.service'

interface UpdateCablesResponse {
  cables: CableModel[]
}

@Injectable({
  providedIn: 'root',
})
export class JoinsService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private cablesEntity: CablesEntityService,
  ) {}

  update(joinId: string, update: string) {
    return this.http
      .put<UpdateCablesResponse>(`api/projects/3/join/${joinId}/cables`, update)
      .subscribe((res) => {
        const entities = res.cables.map((cable) => {
          const partial: Partial<CableModel> = {
            ...cable,
          }
          return partial
        })
        this.cablesEntity.updateManyInCache(entities)
      })
  }
}
