import { CdkDragDrop } from '@angular/cdk/drag-drop'

import { inject, Injectable } from '@angular/core'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '@shared/data-access/store'
import {
  DisconnectionPointsEntityService, PanelsEntityService,
  selectBlocksByProjectIdRouteParams,
} from '@grid-layout/data-access/store'
import { BlockModel, DisconnectionPointModel, PanelModel, TypeModel } from '@shared/data-access/models'



@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private store = inject(Store<AppState>)
  private disconnectionPointsEntity = inject(DisconnectionPointsEntityService)
  private panelsEntity = inject(PanelsEntityService)



  gridDrop(event: CdkDragDrop<any, any>) {
    /*firstValueFrom(this.store.select(selectBlocksByProjectIdRouteParams)).then((blocks) => {
      if (blocks) {
        const doesExist: BlockModel | undefined = blocks.find((block: BlockModel) => block.location.toString() === event.container.id)

        console.error(doesExist)
        if (doesExist) {
          return console.warn(`block already exists as ${event.container.id}`)
        }
        const block: BlockModel = event.item.data
        console.log(block)
        const location = event.container.id

        switch (block.type) {
          case TypeModel.PANEL:
            const panel: Partial<PanelModel> = {
              id: block.id,
              projectId: block.projectId,
              location,
              rotation: 0,
            }
            return this.panelsEntity.update(panel)
          case TypeModel.DISCONNECTIONPOINT:
            const disconnectionPoint: Partial<DisconnectionPointModel> = {
              ...block,
              location,
            }

            return this.disconnectionPointsEntity.update(disconnectionPoint)



          default:
            break
        }
      }
    })*/
  }

}
