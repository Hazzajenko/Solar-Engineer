import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { LinksFacade, LinksStoreService, PanelsFacade, SelectedFacade } from '../../services'
import { LinksPathService } from './links-path.service'
import { ProjectsFacade } from '@projects/data-access'
import { PanelLinkModel, PanelModel, ProjectModel } from '@shared/data-access/models'
import { StringsEventService } from '../strings'
import { PathsEventService } from '../paths'
// import { PathsEventService } from 'libs/grid-layout/data-access/services/src/lib/entitites/paths/paths.service'
// import { StringsEventService } from 'libs/grid-layout/data-access/services/src/lib/entitites/string/string.service'

@Injectable({
  providedIn: 'root',
})
export class LinksFactory {
  // private eventFactory = inject(GridEventFactory)
  private linksPathService = inject(LinksPathService)
  private store = inject(Store)
  private projectsFacade = inject(ProjectsFacade)
  private selectedFacade = inject(SelectedFacade)
  private linksFacade = inject(LinksFacade)
  // private linksFacade = inject(LinksFacade)
  private linksStore = inject(LinksStoreService)
  private panelsFacade = inject(PanelsFacade)
  private stringsFactory = inject(StringsEventService)
  private pathsFactory = inject(PathsEventService /**/)

  async create(panel: PanelModel, panelToLinkId: string | undefined, shiftKey: boolean) {
    const errorChecks = await this.errorChecks(panel, panelToLinkId)
    if (!errorChecks) return
    if (!('project' in errorChecks)) {
      return errorChecks
    }
    const { project, panelToLink, selectedStringId } = errorChecks

    const link = new PanelLinkModel({
      projectId: project.id,
      stringId: selectedStringId,
      positiveToId: panelToLink.id,
      negativeToId: panel.id,
    })

    this.linksStore.dispatch.createLink(link)

    if (shiftKey) {
      this.linksStore.dispatch.startLinkPanel(panel.id)
    } else {
      this.linksStore.dispatch.clearLinkState()
    }

    const panelPaths = await this.linksPathService.orderPanelsInLinkOrderWithLinkAsync(link)
    if (panelPaths) {
      // this.store.dispatch(SelectedActions.setSelectedStringLinkPaths({ pathMap: linkPathMap }))
      // const name = 'sadsakodsa'
      // const panelPathRecord: PanelPathRecord = Object.fromEntries(linkPathMap)
      // await this.stringsFactory.updateString(selectedStringId, { panelPaths })
      await this.pathsFactory.createManyPaths(panelPaths)
      // this.store.dispatch(StringsActions.updateStringPathmap({ linkPathMap: result }))
    }

    // const linkPathMap = await firstValueFrom(this.linksPathService.orderPanelsInLinkOrderWithLink(link))

    return
  }

  async startLinkPanel(panelId: string) {
    this.linksStore.dispatch.startLinkPanel(panelId)

    return
  }

  async deleteLink(panelId: string, link: 'POSITIVE' | 'NEGATIVE') {
    if (link === 'POSITIVE') {
      const positiveLink = await this.linksFacade.isPanelExistingPositiveLink(panelId)
      if (!positiveLink) return
      this.linksStore.dispatch.deleteLink(positiveLink.id)
    }
    if (link === 'NEGATIVE') {
      const negativeLink = await this.linksFacade.isPanelExistingNegativeLink(panelId)
      if (!negativeLink) return
      this.linksStore.dispatch.deleteLink(negativeLink.id)
    }
  }

  private async errorChecks(
    panel: PanelModel,
    panelToLinkId: string | undefined,
  ): Promise<
    | undefined
    | {
        project: ProjectModel
        panelToLink: PanelModel
        selectedStringId: string
      }
  > {
    const project = await this.projectsFacade.projectFromRoute
    if (!project) {
      return undefined
    }

    if (!panelToLinkId) {
      await this.startLinkPanel(panel.id)
      return undefined
    }

    const panelToLink = await this.panelsFacade.panelById(panelToLinkId)
    if (!panelToLink) {
      await this.startLinkPanel(panel.id)
      return undefined
    }

    const existingNegLink = await this.linksFacade.isPanelExistingNegativeLink(panel.id)
    if (existingNegLink) {
      return undefined
    }

    if (panel.stringId !== panelToLink.stringId) {
      return undefined
    }

    const selectedStringId = await this.selectedFacade.selectedStringId
    if (!selectedStringId) {
      return undefined
    }

    return {
      project,
      panelToLink,
      selectedStringId,
    }
  }
}
