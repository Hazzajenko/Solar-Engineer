import { Injectable, inject } from '@angular/core'
import { GridEventFactory } from '@grid-layout/data-access/utils'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { SelectedFacade } from '@project-id/data-access/facades'
import {
  BlocksSelectors,
  BlocksActions,
  PanelsSelectors,
  SelectedSelectors,
} from '@project-id/data-access/store'
import { ProjectsSelectors } from '@projects/data-access/store'
import { BlockModel, PanelModel, TypeModel } from '@shared/data-access/models'
import { firstValueFrom, Observable } from 'rxjs'

import { BlockService } from './block.service'

interface BlockFactoryModel {
  create(): Promise<BlockModel | undefined>
}

@Injectable({
  providedIn: 'root',
})
export class BlockFactory {
  private readonly store = inject(Store)
  private readonly facade = inject(SelectedFacade)
  // private service = inject(BlockService)

  private readonly projectId$ = this.store.select(ProjectsSelectors.selectProjectIdByRouteParams)
  private readonly selectedStringId$ = this.store.select(SelectedSelectors.selectSelectedStringId)

  async projectId() {
    return firstValueFrom(this.projectId$)
  }

  async selectedStringId() {
    return firstValueFrom(this.selectedStringId$)
  }

  /*   async create(location: string, rotation: number) {
    const projectId = await firstValueFrom(this.projectId$)
    const selectedStringId = await firstValueFrom(this.selectedStringId$)

    if(!projectId) return
    return new PanelModel({
      projectId,
      stringId: selectedStringId ? selectedStringId : 'undefined',
      location,
      rotation
    })
  } */
}

@Injectable({
  providedIn: 'root',
})
export class PanelFactory extends BlockFactory {
  private result = new GridEventFactory()
  async create(location: string, rotation: number) {
    const projectId = await this.projectId()
    const selectedStringId = await this.selectedStringId()

    if (!projectId) {
      return this.result.error('project undefined')
    }
    const panel = new PanelModel({
      projectId,
      stringId: selectedStringId ? selectedStringId : 'undefined',
      location,
      rotation,
    })
    return this.result.action({ action: 'CREATE_PANEL', data: { panel } })
  }
}
