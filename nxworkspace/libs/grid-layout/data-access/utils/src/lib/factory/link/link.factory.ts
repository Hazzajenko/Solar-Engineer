import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { Store } from '@ngrx/store'
import { LinksFacade, PanelsFacade, SelectedFacade } from '@project-id/data-access/facades'
import { SelectedActions, StringsActions } from '@project-id/data-access/store'
import { LinksPathService } from '@project-id/utils'
import { ProjectsFacade } from '@projects/data-access/facades'
import { PanelLinkModel, PanelModel, ProjectModel, StringModel } from '@shared/data-access/models'
import { PathsFactory } from 'libs/grid-layout/data-access/utils/src/lib/factory/paths/paths.factory'
import { StringFactory } from 'libs/grid-layout/data-access/utils/src/lib/factory/string'
import { firstValueFrom } from 'rxjs'
import { GridEventFactory } from '../../grid.factory'

@Injectable({
  providedIn: 'root',
})
export class LinkFactory {
  private eventFactory = inject(GridEventFactory)
  private linksPathService = inject(LinksPathService)
  private store = inject(Store)
  private projectsFacade = inject(ProjectsFacade)
  private selectedFacade = inject(SelectedFacade)
  private linksFacade = inject(LinksFacade)
  private panelsFacade = inject(PanelsFacade)
  private stringsFactory = inject(StringFactory)
  private pathsFactory = inject(PathsFactory)

  async create(
    panel: PanelModel,
    panelToLinkId: string | undefined,
    shiftKey: boolean,
  ): Promise<GridEventResult> {
    const errorChecks = await this.errorChecks(panel, panelToLinkId)
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

    this.linksFacade.createLink(link)

    if (shiftKey) {
      this.linksFacade.startLinkPanel(panel.id)
    } else {
      this.linksFacade.clearLinkState()
    }

    const panelPaths = await this.linksPathService.orderPanelsInLinkOrderWithLinkAsync(link)
    if (panelPaths) {
      // this.store.dispatch(SelectedActions.setSelectedStringLinkPaths({ pathMap: linkPathMap }))
      // const name = 'sadsakodsa'
      // const panelPathRecord: PanelPathRecord = Object.fromEntries(linkPathMap)
      await this.stringsFactory.updateString(selectedStringId, { panelPaths })
      await this.pathsFactory.createManyPaths(panelPaths)
      // this.store.dispatch(StringsActions.updateStringPathmap({ linkPathMap: result }))

    }

    // const linkPathMap = await firstValueFrom(this.linksPathService.orderPanelsInLinkOrderWithLink(link))

    return this.eventFactory.action({
      action: 'ADD_LINK',
      data: {
        link,
        shiftKey,
      },
    })
  }

  async startLinkPanel(panelId: string): Promise<GridEventResult> {
    this.linksFacade.startLinkPanel(panelId)

    return this.eventFactory.action({ action: 'START_LINK_PANEL', data: { panelId } })
  }

  async deleteLink(panelId: string, link: 'POSITIVE' | 'NEGATIVE') {
    if (link === 'POSITIVE') {
      const positiveLink = await this.linksFacade.isPanelExistingPositiveLink(panelId)
      if (!positiveLink) return
      this.linksFacade.deleteLink(positiveLink.id)
    }
    if (link === 'NEGATIVE') {
      const negativeLink = await this.linksFacade.isPanelExistingNegativeLink(panelId)
      if (!negativeLink) return
      this.linksFacade.deleteLink(negativeLink.id)
    }
  }

  private async errorChecks(
    panel: PanelModel,
    panelToLinkId: string | undefined,
  ): Promise<
    | GridEventResult
    | {
    project: ProjectModel
    panelToLink: PanelModel
    selectedStringId: string
  }
  > {
    const project = await this.projectsFacade.projectFromRoute
    if (!project) {
      return this.eventFactory.fatal('project is undefined')
    }

    if (!panelToLinkId) {
      return this.startLinkPanel(panel.id)
    }

    const panelToLink = await this.panelsFacade.panelById(panelToLinkId)
    if (!panelToLink) {
      return this.startLinkPanel(panel.id)
    }

    const existingNegLink = await this.linksFacade.isPanelExistingNegativeLink(panel.id)
    if (existingNegLink) {
      return this.eventFactory.error('the panel already has a negative link')
    }

    if (panel.stringId !== panelToLink.stringId) {
      return this.eventFactory.error('both panels need to be on the same string to link')
    }

    const selectedStringId = await this.selectedFacade.selectedStringId
    if (!selectedStringId) {
      return this.eventFactory.error('need to select a string to link')
    }

    return {
      project,
      panelToLink,
      selectedStringId,
    }
  }
}
