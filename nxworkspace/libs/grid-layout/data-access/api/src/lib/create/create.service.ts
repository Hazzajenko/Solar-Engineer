import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'

import {
  DisconnectionPointsEntityService,
  PanelsEntityService,
  selectBlocksByProjectIdRouteParams,
  selectCreateMode,
  selectCurrentProjectId,
  selectSelectedStringId,
  selectSelectedUnitAndIds,
  TraysEntityService,
} from '@grid-layout/data-access/store'
import {
  BlockModel,
  DisconnectionPointModel,
  PanelModel,
  TrayModel,
  TypeModel,
} from '@shared/data-access/models'
import { AppState } from '@shared/data-access/store'
import { combineLatestWith, firstValueFrom } from 'rxjs'
import { ProjectGridPage } from '../../../../../../../apps/solarengineer/src/app/pages/project-grid/project-grid.page'

@Injectable({
  // providedIn: ProjectGridPage,
  providedIn: 'root',
})
export class CreateService {
  private store = inject(Store<AppState>)
  private panelsEntity = inject(PanelsEntityService)
  private traysEntity = inject(TraysEntityService)
  private disconnectionPointsEntity = inject(DisconnectionPointsEntityService)

  createSwitch(location: string) {
    firstValueFrom(
      this.store
        .select(selectBlocksByProjectIdRouteParams)
        .pipe(combineLatestWith(this.store.select(selectCreateMode))),
    ).then(([blocks, createMode]) => {
      const doesExist: BlockModel | undefined = blocks.find((block: BlockModel) => block.location === location)
      if (doesExist) {
        return console.log('cell location taken')
      }

      switch (createMode) {
        case TypeModel.PANEL:
          return this.createPanelForGrid(location)

        case TypeModel.DISCONNECTIONPOINT:
          return this.createDisconnectionPointForGrid(location)

        case TypeModel.TRAY:
          return this.createTrayForGrid(location)

        default:
          break
      }
    })
  }

  async createPanelForGrid(location: string, childBlock?: BlockModel) {
    const [selected, projectID] = await firstValueFrom(
      this.store
        .select(selectSelectedUnitAndIds)
        .pipe(combineLatestWith(this.store.select(selectCurrentProjectId))),
    )
    if (childBlock) {
      if (!selected.singleSelectId && selected.type !== TypeModel.STRING) {
        const panelRequest = new PanelModel(projectID, location, 'undefined', 0)

        this.panelsEntity.add(panelRequest)
      } else if (selected.singleSelectId && selected.type === TypeModel.STRING) {
        const panelRequest = new PanelModel(projectID, location, selected.selectedStringId!, 0)

        this.panelsEntity.add(panelRequest)
      }
    } else {
      if (!selected.singleSelectId && selected.type !== TypeModel.STRING) {
        const panelRequest = new PanelModel(projectID, location, 'undefined', 0)

        this.panelsEntity.add(panelRequest)
      } else if (selected.singleSelectId && selected.type === TypeModel.STRING) {
        const panelRequest = new PanelModel(projectID, location, selected.selectedStringId!, 0)

        this.panelsEntity.add(panelRequest)
      }
    }

    /*firstValueFrom(this.store.select(selectSelectedUnitAndIds)).then((state) => {
      if (childBlock) {
        if (!state.singleSelectId && state.type !== TypeModel.STRING) {
          console.log('        if (!selectedStringId) {')
          // const panelRequest = new PanelModel(location, 'undefined', 0)
          const panelRequest = this.panelsService.createPanelWithDefaultValues(
            location,
            'undefined',
            0,
          )

          /!*          const panelRequest: PanelModel = {
                      id: Guid.create().toString(),
                      stringId: 'undefined',
                      location,
                      rotation: 0,
                      // has_child_block: true,
                      child_block_id: childBlock.id,
                      child_block_model: childBlock.model,
                    }*!/

          this.panelsEntity.add(panelRequest)
        } else if (state.singleSelectId && state.type === TypeModel.STRING) {
          console.log('        } else if (selectedStringId.length > 0) {')
          /!*          const panelRequest: PanelModel = {
                      id: Guid.create().toString(),
                      stringId: state.selectedStringId!,
                      location,
                      rotation: 0,
                      // has_child_block: false,
                      child_block_id: childBlock.id,
                      child_block_model: childBlock.model,
                    }*!/
          const panelRequest = new PanelModel(location, state.selectedStringId!, 0)

          this.panelsEntity.add(panelRequest)
        }
      } else {
        if (!state.singleSelectId && state.type !== TypeModel.STRING) {
          /!*          const panelRequest: PanelModel = {
                      id: Guid.create().toString(),
                      stringId: 'undefined',
                      location,
                      rotation: 0,
                    }*!/
          const panelRequest = new PanelModel(location, 'undefined', 0)

          this.panelsEntity.add(panelRequest)
          // this.store.dispatch(PanelStateActions.addPanel({ panel: panelRequest }))
        } else if (state.singleSelectId && state.type === TypeModel.STRING) {
          /!*          const panelRequest: PanelModel = {
                      id: Guid.create().toString(),
                      stringId: state.selectedStringId!,
                      location,
                      rotation: 0,
                    }*!/
          const panelRequest = new PanelModel(location, state.selectedStringId!, 0)

          this.panelsEntity.add(panelRequest)
        }
      }
    })*/
  }

  createDisconnectionPointForGrid(location: string) {
    firstValueFrom(this.store.select(selectSelectedStringId)).then((stringId) => {
      if (stringId) {
        /*        const disconnectionPointModel: DisconnectionPointModel = {
          id: Guid.create().toString(),
          projectId: 3,
          stringId: stringId,
          disconnectionPointType: DisconnectionPointType.MC4,
          positiveId: 'undefined',
          negativeId: 'undefined',
          location,
          color: 'black',
          type: TypeModel.DISCONNECTIONPOINT,
        }*/

        const disconnectionPoint = new DisconnectionPointModel(
          1,
          stringId,
          location,
          'undefined',
          'undefined',
        )

        this.disconnectionPointsEntity.add(disconnectionPoint)
      } else {
        console.error('a string needs to be selected to create a disconnection point')
      }
    })
  }

  createTrayForGrid(location: string) {
    firstValueFrom(this.store.select(selectCurrentProjectId)).then((projectId) => {
      const trayRequest = new TrayModel(projectId, location, 150)

      this.traysEntity.add(trayRequest)
    })
  }
}
