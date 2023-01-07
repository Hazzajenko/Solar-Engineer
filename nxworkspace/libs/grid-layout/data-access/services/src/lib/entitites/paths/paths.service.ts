import { inject, Injectable } from '@angular/core'
import { PathsStoreService, SelectedFacade, SelectedStoreService } from '@project-id/data-access/facades'

import { ProjectsFacade } from '@projects/data-access/facades'
import {
  PanelIdPath,
  PanelPathModel,
  SelectedPanelLinkPathModel,
  SelectedPathModel,
  StringLinkPathModel,
} from '@shared/data-access/models'
import { LinksPathService } from '../links/links-path.service'

@Injectable({
  providedIn: 'root',
})
export class PathsFactory {

  private projectsFacade = inject(ProjectsFacade)
  private selectedFacade = inject(SelectedFacade)

  private linksPathService = inject(LinksPathService)
  private pathsStore = inject(PathsStoreService)
  private selectedStore = inject(SelectedStoreService)

  async createPath(panelId: string, panelPath: PanelPathModel) {
    const project = await this.projectsFacade.projectFromRoute
    const selectedStringId = await this.selectedFacade.selectedStringId
    if (!selectedStringId) return console.error('!selectedStringId')

    if (!project) {
      return
    }
    const path = new StringLinkPathModel({
      projectId: project.id,
      stringId: selectedStringId,
      panelId,
      panelPath,
    })
    // this.pathsFacade.
    this.pathsStore.dispatch.createPath(path)
    // return this.eventFactory.action({ action: 'CREATE_PANEL', data: { panel } })
  }

  async createManyPaths(panelIdPaths: PanelIdPath[]) {
    const project = await this.projectsFacade.projectFromRoute
    const selectedStringId = await this.selectedStore.select.selectedStringId
    if (!selectedStringId) return console.error('!selectedStringId')

    if (!project) {
      return
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
    this.pathsStore.dispatch.createManyPaths(paths)
    // return this.eventFactory.action({ action: 'CREATE_PANEL', data: { panel } })
  }

  async setSelectedPanelPaths(selectedPanelId: string) {
    const project = await this.projectsFacade.projectFromRoute
    const selectedStringId = await this.selectedFacade.selectedStringId
    if (!selectedStringId) {
      return
    }

    if (!project) {
      console.error('project undefined')
      return
    }
    const panelIdPaths = await this.linksPathService.orderPanelsInLinkOrderForSelectedPanel(selectedPanelId)
    // console.error(panelIdPaths)
    if (!panelIdPaths) {
      // console.error('panelIdPaths undefined')
      this.pathsStore.dispatch.clearSelectedPanelPaths()
      return
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
    this.pathsStore.dispatch.setSelectedPanelPaths(selectedPanelLinkPath)
    return
  }

  clearSelectedPanelPaths() {
    this.pathsStore.dispatch.clearSelectedPanelPaths()
  }
}
