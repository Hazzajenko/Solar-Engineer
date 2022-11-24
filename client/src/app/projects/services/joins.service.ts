import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { CableModel } from '../models/cable.model'
import { CablesEntityService } from '../project-id/services/cables-entity/cables-entity.service'
import { JoinModel } from '../models/join.model'
import { UnitModel } from '../models/unit.model'
import { JoinsEntityService } from '../project-id/services/joins-entity/joins-entity.service'
import { environment } from '../../../environments/environment'

interface UpdateCablesResponse {
  cables: CableModel[]
}

interface CreateJoinResponse {
  join: JoinModel
}

@Injectable({
  providedIn: 'root',
})
export class JoinsService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private cablesEntity: CablesEntityService,
    private joinsEntity: JoinsEntityService,
  ) {}

  createJoin(projectId: number, joinId: string): Promise<JoinModel> {
    const joinRequest: JoinModel = {
      id: joinId,
      project_id: projectId,
      color: 'purple',
      model: UnitModel.JOIN,
      size: 4,
      type: 'JOIN',
    }
    return new Promise<JoinModel>((resolve, reject) =>
      this.joinsEntity.add(joinRequest).subscribe({
        next: (joinModel) => {
          resolve(joinModel)
        },
        error: (err) => {
          reject(err)
        },
        complete: () => {
          console.log('createJoin')
        },
      }),
    )
  }

  updateCablesInJoin(projectId: number, joinId: string, updatedJoinId: string) {
    return this.http.put<UpdateCablesResponse>(
      `${environment.apiUrl}/projects/${projectId}/join/${joinId}/cables`,
      {
        project_id: projectId,
        changes: {
          new_join_id: updatedJoinId,
          old_join_id: joinId,
        },
      },
    )
  }
}
