import { inject, Injectable } from '@angular/core'
import { GridEventFactory, PanelFactory } from '@grid-layout/data-access/utils'
import { GridFacade, SelectedFacade } from '@project-id/data-access/facades'
import { ProjectsFacade } from '@projects/data-access/facades'
import { BlockType, GridMode, PanelModel } from '@shared/data-access/models'

import { match } from 'ts-pattern'

import { GridEventResult } from '@grid-layout/data-access/actions'

@Injectable({
  providedIn: 'root',
})
export class ClickCreate {
  // private result = inject(GridEventFactory)
  // private result = new GridEventFactory()
  private eventFactory = inject(GridEventFactory)
  private panelFactory = inject(PanelFactory)
  private gridFacade = inject(GridFacade)
  private projectsFacade = inject(ProjectsFacade)
  private selectedFacade = inject(SelectedFacade)

  async createSwitch(location: string): Promise<GridEventResult> {
    const createMode = await this.gridFacade.createMode
    switch (createMode){
      case BlockType.PANEL: return this.panelFactory.create(location, 0)
      default: return this.eventFactory.error('createSwitch, default')
    }
/*     return match(createMode)
      .with(BlockType.PANEL, async () => this.panelFactory.create(location, 0))
      // .with(BlockType.PANEL, async () => this.createPanelEvent(location))
      .otherwise(async () => this.eventFactory.error('createSwitch, default')) */
  }
/*
  private async createPanelEvent(location: string): Promise<GridEventResult> {
    const selectedStringId = await this.selectedFacade.selectedStringId
    const project = await this.projectsFacade.projectFromRoute
    if (!project) {
      return this.eventFactory.fatal('createPanelEvent, !project')
    }
    const panel = new PanelModel({
      projectId: project.id,
      stringId: selectedStringId ? selectedStringId : 'undefined',
      location,
      rotation: 0,
      // type: BlockType.PANEL,
    })

    return this.eventFactory.action({ action: 'CREATE_PANEL', data: { panel } })
  } */
}
