import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { PanelsFacade, SelectedFacade } from '@project-id/data-access/facades'
import { PathsRepository } from '@project-id/data-access/repositories'
import { ProjectsFacade } from '@projects/data-access/facades'
import { PanelIdPath, PanelLinkPathModel, PanelModel, PanelPathModel } from '@shared/data-access/models'
import { PathsFacade } from 'libs/project-id/data-access/facades/src/lib/paths.facade'
import { combineLatest, firstValueFrom, map } from 'rxjs'
import { GridEventFactory } from '../../grid.factory'
import { toUpdatePanelArray } from '../utils/update-panel-map'

@Injectable({
  providedIn: 'root',
})
export class PathsFactory {
  private eventFactory = inject(GridEventFactory)
  private store = inject(Store)
  private projectsFacade = inject(ProjectsFacade)
  private selectedFacade = inject(SelectedFacade)
  private panelsFacade = inject(PanelsFacade)
  private pathsFacade = inject(PathsFacade)
  private pathsRepository = inject(PathsRepository)

  async createPath(panelId: string, panelPath: PanelPathModel) {
    const project = await this.projectsFacade.projectFromRoute
    const selectedStringId = await this.selectedFacade.selectedStringId
    if (!selectedStringId) return console.error('!selectedStringId')

    if (!project) {
      return this.eventFactory.error('project undefined')
    }
    const path = new PanelLinkPathModel({
      projectId: project.id,
      stringId: selectedStringId,
      panelId,
      panelPath,
    })
    // this.pathsFacade.
    this.pathsRepository.createPath(path)
    // return this.eventFactory.action({ action: 'CREATE_PANEL', data: { panel } })
  }

  async createManyPaths(panelIdPaths: PanelIdPath[]) {
    const project = await this.projectsFacade.projectFromRoute
    const selectedStringId = await this.selectedFacade.selectedStringId
    if (!selectedStringId) return console.error('!selectedStringId')

    if (!project) {
      return this.eventFactory.error('project undefined')
    }
    const paths = panelIdPaths.map(panelIdPath => {
      return new PanelLinkPathModel({
        projectId: project.id,
        stringId: selectedStringId,
        panelId: panelIdPath.panelId,
        panelPath: panelIdPath.path,
      })
    })
    /*    const path = new PanelLinkPathModel({
          projectId: project.id,
          stringId: selectedStringId,
          panelId,
          panelPath,
        })*/
    // this.pathsFacade.
    this.pathsRepository.createManyPaths(paths)
    // return this.eventFactory.action({ action: 'CREATE_PANEL', data: { panel } })
  }
}
