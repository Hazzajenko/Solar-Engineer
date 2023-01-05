import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { PanelsFacade, SelectedFacade } from '@project-id/data-access/facades'
import { PathsRepository } from '@project-id/data-access/repositories'
import { LinksPathService } from '@project-id/utils'
import { ProjectsFacade } from '@projects/data-access/facades'
import {
  PanelIdPath,
  StringLinkPathModel,
  PanelModel,
  PanelPathModel,
  SelectedPanelLinkPathModel, SelectedPathModel,
} from '@shared/data-access/models'
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
  private linksPathService = inject(LinksPathService)
  private pathsRepository = inject(PathsRepository)

  async createPath(panelId: string, panelPath: PanelPathModel) {
    const project = await this.projectsFacade.projectFromRoute
    const selectedStringId = await this.selectedFacade.selectedStringId
    if (!selectedStringId) return console.error('!selectedStringId')

    if (!project) {
      return this.eventFactory.error('project undefined')
    }
    const path = new StringLinkPathModel({
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
      return new StringLinkPathModel({
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

  async setSelectedPanelPaths(selectedPanelId: string) {
    const project = await this.projectsFacade.projectFromRoute
    const selectedStringId = await this.selectedFacade.selectedStringId
    if (!selectedStringId) {
      return this.eventFactory.error('selectedStringId undefined')
    }

    if (!project) {
      console.error('project undefined')
      return this.eventFactory.error('project undefined')
    }
    const panelIdPaths = await this.linksPathService.orderPanelsInLinkOrderForSelectedPanel(selectedPanelId)
    // console.error(panelIdPaths)
    if (!panelIdPaths) {
      // console.error('panelIdPaths undefined')
      this.pathsRepository.clearSelectedPanelPaths()
      return this.eventFactory.error('panelIdPaths undefined')
    }

    const panelPaths = panelIdPaths.map(panelIdPath => {

      const panelPath: SelectedPathModel = {
        panelId: panelIdPath.panelId,
        count: panelIdPath.path.count,
      }
      return panelPath

    })
    const selectedPanelLinkPath: SelectedPanelLinkPathModel = {
      selectedPanelId,
      panelPaths,
    }
    /*    const path = new PanelLinkPathModel({
          projectId: project.id,
          stringId: selectedStringId,
          panelId,
          panelPath,
        })*/
    // this.pathsFacade.

    // await this.pathsFactory.createManyPaths(res)
    this.pathsRepository.setSelectedPanelPaths(selectedPanelLinkPath)
    return this.eventFactory.undefined('')
  }

  clearSelectedPanelPaths() {
    this.pathsRepository.clearSelectedPanelPaths()
  }
}
