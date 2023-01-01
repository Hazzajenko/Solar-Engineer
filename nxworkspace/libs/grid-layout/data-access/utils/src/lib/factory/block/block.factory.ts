import { PanelDirective } from './../../../../../../feature/blocks/block-panel/src/lib/directives/panel.directive';
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { SelectedFacade } from '@project-id/data-access/facades'
import { ProjectsFacade } from '@projects/data-access/facades'
import { PanelModel } from '@shared/data-access/models';
import { GridEventFactory } from '../../grid.factory';
import { GridEventResult } from '@grid-layout/data-access/actions';

export interface BlockFactoryModel {
  projectId: () => Promise<number | undefined>
  selectedStringId: () => Promise<string | undefined>
  // create: () => Promise<GridEventResult>
}

@Injectable({
  providedIn: 'root',
})
export class BlockFactory implements BlockFactoryModel {
  result = inject(GridEventFactory)
  // private readonly projectId$ = this.store.select(ProjectsSelectors.selectProjectIdByRouteParams)
  private readonly projectId$ = inject(ProjectsFacade).currentProjectId
  // private readonly selectedStringId$ = this.store.select(SelectedSelectors.selectSelectedStringId)
  private readonly selectedStringId$ = inject(SelectedFacade).selectedStringId

  async projectId() {
    return this.projectId$
  }

  async selectedStringId() {
    return this.selectedStringId$
  }
/* 
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
  } */
}
