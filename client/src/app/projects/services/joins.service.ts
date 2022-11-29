import { DisconnectionPointsEntityService } from './../project-id/services/disconnection-points-entity/disconnection-points-entity.service'
import { PanelJoinsEntityService } from './../project-id/services/panel-joins-entity/panel-joins-entity.service'
import { PanelsEntityService } from './../project-id/services/panels-entity/panels-entity.service'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { JoinModel } from '../models/join.model'
import { UnitModel } from '../models/unit.model'
import { JoinsEntityService } from '../project-id/services/joins-entity/joins-entity.service'
import { Guid } from 'guid-typescript'
import { PanelJoinModel } from '../models/panel-join.model'
import { PanelModel } from '../models/panel.model'
import { JoinsStateActions } from '../store/joins/joins.actions'
import { JoinsState } from '../store/joins/joins.reducer'
import { DisconnectionPointModel } from '../models/disconnection-point.model'
import { GridMode } from '../store/grid/grid-mode.model'
import { ProjectModel } from '../models/project.model'
import { BlockModel } from '../models/block.model'
import { StringModel } from '../models/string.model'
import { combineLatest } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class JoinsService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private panelJoinsEntity: PanelJoinsEntityService,
    private joinsEntity: JoinsEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
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

  addPanelToJoin(
    panel: PanelModel,
    gridMode?: GridMode,
    joinsState?: JoinsState,
  ) {
    if (joinsState?.typeToJoin) {
      switch (joinsState.typeToJoin) {
        case UnitModel.PANEL:
          if (joinsState.panelToJoin) {
            this.joinPanelToPanel(panel, joinsState.panelToJoin)
          }
          break
        case UnitModel.DISCONNECTIONPOINT:
          if (joinsState.dpToJoin) {
            this.joinPanelToDp(panel, joinsState.dpToJoin)
          }
          break
      }
    } else {
      if (panel) {
        this.store.dispatch(JoinsStateActions.addToJoinPanel({ panel }))
      }
    }
  }

  addDpToJoin(dpLocation: string, project: ProjectModel) {
    let dp: DisconnectionPointModel | undefined
    let blockToJoin: BlockModel | undefined
    let panelToJoin: PanelModel | undefined
    let dpToJoin: DisconnectionPointModel | undefined
    let dpString: StringModel | undefined
    combineLatest([
      this.panelsEntity.entities$,
      this.stringsEntity.entities$,
      this.disconnectionPointsEntity.entities$,
    ]).subscribe(([panels$, strings$, dps$]) => {
      dp = dps$.find((dp) => dp.location === dpLocation)
      dpString = strings$.find((s) => s.id === dp?.string_id)

      //   if (blockToJoin$) {
      //     blockToJoin = blockToJoin$
      //     switch (blockToJoin$?.model) {
      //       case UnitModel.PANEL:
      //         panelToJoin = panels$.find(
      //           (p) => p.location === blockToJoin$.location,
      //         )
      //         break
      //       case UnitModel.DISCONNECTIONPOINT:
      //         dpToJoin = dps$.find((dp) => dp.location === blockToJoin$.location)
      //         break
      //     }
      //   }
      // })

      if (blockToJoin) {
        switch (blockToJoin?.model) {
          case UnitModel.PANEL:
            this.joinDpToPanel(project, panelToJoin!, dpString!, dp!)
            break
          case UnitModel.DISCONNECTIONPOINT:
            console.log('err cannot join dp to dp')
            break
        }
      } else {
        if (dp) {
          const block: BlockModel = {
            id: dp.id,
            model: UnitModel.DISCONNECTIONPOINT,
            location: dp.location!,
            project_id: project.id,
          }
          // this.store.dispatch(JoinsStateActions.addToBlockJoin({ block }))
        }
      }
    })
  }
}

  joinSwitch(panel: PanelModel, joinsState?: JoinsState) {
    if (joinsState?.typeToJoin) {
      switch (joinsState.typeToJoin) {
        case UnitModel.PANEL:
          if (joinsState.panelToJoin) {
            this.joinPanelToPanel(panel, joinsState.panelToJoin)
          }
          break
        case UnitModel.DISCONNECTIONPOINT:
          if (joinsState.dpToJoin) {
            this.joinPanelToDp(panel, joinsState.dpToJoin)
          }
          break
      }
    } else {
      if (panel) {
        this.store.dispatch(JoinsStateActions.addToJoinPanel({ panel }))
      }
    }
  }

  joinPanelToPanel(panel?: PanelModel, panelToJoin?: PanelModel) {
    if (!panel) return

    if (panelToJoin && panel) {
      const panelJoinRequest: PanelJoinModel = {
        id: Guid.create().toString(),
        project_id: panelToJoin.project_id,
        string_id: panelToJoin.string_id,
        positive_id: panelToJoin.id,
        positive_model: UnitModel.PANEL,
        negative_id: panel.id,
        negative_model: UnitModel.PANEL,
      }

      this.panelJoinsEntity.add(panelJoinRequest)

      const updatePanel: PanelModel = {
        ...panel,
        string_id: panelToJoin.string_id,
        color: panel.color,
      }
      this.panelsEntity.update(updatePanel)
    }

    this.store.dispatch(JoinsStateActions.addToJoinPanel({ panel }))
  }

  joinPanelToDp(panel?: PanelModel, dpToJoin?: DisconnectionPointModel) {
    if (!panel) return

    if (dpToJoin && panel) {
      const update: Partial<DisconnectionPointModel> = {
        ...dpToJoin,
        string_id: panel.string_id,
        negative_id: panel.id,
      }

      this.disconnectionPointsEntity.update(update)

      const panelJoinRequest: PanelJoinModel = {
        id: Guid.create().toString(),
        project_id: panel.project_id,
        string_id: panel.string_id,
        negative_id: panel.id,
        negative_model: UnitModel.PANEL,
        positive_id: dpToJoin.id,
        positive_model: UnitModel.DISCONNECTIONPOINT,
      }

      this.panelJoinsEntity.add(panelJoinRequest)
    }

    this.store.dispatch(JoinsStateActions.addToJoinPanel({ panel }))
  }

  updateCablesInJoin(projectId: number, joinId: string, updatedJoinId: string) {
    // return this.http.put<UpdateCablesResponse>(
    //   `${environment.apiUrl}/projects/${projectId}/join/${joinId}/cables`,
    //   {
    //     project_id: projectId,
    //     changes: {
    //       new_join_id: updatedJoinId,
    //       old_join_id: joinId,
    //     },
    //   },
    // )
  }
}
