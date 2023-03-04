import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import {
  LinksStoreService,
  PanelsStoreService,
  PathsStoreService,
  SelectedStoreService,
} from '@project-id/data-access/facades'

import { ProjectsFacade } from '@projects/data-access/facades'
import { PanelModel } from '@shared/data-access/models'
import { combineLatest, firstValueFrom, map } from 'rxjs'
import { getSelectedLinks } from '../links/get-selected-links'
// import { PathsEventService } from 'libs/grid-layout/data-access/services/src/lib/entitites/paths/paths.service'
import { toUpdatePanelArray } from './update-panel-map'
import { PathsService } from '../paths'

@Injectable({
  providedIn: 'root',
})
export class PanelsService {
  private projectsFacade = inject(ProjectsFacade)
  private pathsFactory = inject(PathsService)
  private linksStore = inject(LinksStoreService)
  private panelsStore = inject(PanelsStoreService)
  private selectedStore = inject(SelectedStoreService)
  private pathsStore = inject(PathsStoreService)

  async createPanel(location: string, rotation: number) {
    const project = await this.projectsFacade.projectFromRoute
    const selectedStringId = await this.selectedStore.select.selectedStringId

    if (!project) {
      return
    }
    const panel = new PanelModel({
      projectId: project.id,
      stringId: selectedStringId ? selectedStringId : 'undefined',
      location,
      rotation,
    })
    this.panelsStore.dispatch.createPanel(panel)
    this.selectedStore.dispatch.clearSingleSelected()
    this.pathsStore.dispatch.clearSelectedPanelPaths()
    return
  }

  async selectPanel(panel: PanelModel, shiftKey: boolean) {
    const selectedStringId = await this.selectedStore.select.selectedStringId

    const links = await this.linksStore.select.allLinks
    const panelLink = getSelectedLinks(links, panel.id)

    if (selectedStringId && selectedStringId === panel.stringId) {
      await this.selectedStore.dispatch.selectPanelWhenStringSelected(panel.id, panelLink)
      await this.pathsFactory.setSelectedPanelPaths(panel.id)
      // await this.pathsFactory.clearSelectedPanelPaths()
      return
    }

    if (shiftKey) {
      this.selectedStore.dispatch.addPanelToMultiSelect(panel.id)
      await this.pathsFactory.setSelectedPanelPaths(panel.id)
      await this.pathsStore.dispatch.clearSelectedPanelPaths()
      return
    }

    await this.selectedStore.dispatch.selectPanel(panel.id, panelLink)
    await this.pathsFactory.setSelectedPanelPaths(panel.id)
    await this.pathsStore.dispatch.clearSelectedPanelPaths()
    return
  }

  async updatePanel(panelId: string, changes: Partial<PanelModel>) {
    const update: Update<PanelModel> = {
      id: panelId,
      changes,
    }
    this.panelsStore.dispatch.updatePanel(update)

    return
  }

  async rotateSelectedPanels(rotation: number) {
    const selectedPanelIds = await firstValueFrom(
      combineLatest([
        this.selectedStore.select.multiSelectIds$,
        this.panelsStore.select.allPanels$,
      ]).pipe(
        map(([multiSelectIds, panels]) =>
          panels.filter((p) => multiSelectIds?.includes(p.id)).map((panels) => panels.id),
        ),
      ),
    )
    const updates = toUpdatePanelArray(selectedPanelIds, { rotation })

    this.panelsStore.dispatch.updateManyPanels(updates)

    // return this.eventFactory.action({ action: 'UPDATE_PANEL', data: { update } })
  }

  async deletePanel(panelId: string) {
    this.panelsStore.dispatch.deletePanel(panelId)
    return
  }
}
