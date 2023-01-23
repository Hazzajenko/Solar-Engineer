import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import {
  GridFacade,
  GridStoreService,
  PanelsFacade,
  PanelsStoreService,
  SelectedFacade,
  SelectedStoreService,
  StringsFacade,
  StringsStoreService,
} from '@project-id/data-access/facades'
import { LinksPathService } from '../links'
import { ProjectsFacade } from '@projects/data-access/facades'
import { BlockType, GridMode, StringModel } from '@shared/data-access/models'
// import { getRandomColor } from '../'
import { combineLatest, combineLatestWith, firstValueFrom, map } from 'rxjs'

import { toUpdatePanelArray } from './update-panel-map'

@Injectable({
  providedIn: 'root',
})
export class StringsService {

  private readonly projectsFacade = inject(ProjectsFacade)
  private readonly gridFacade = inject(GridFacade)
  private readonly selectedFacade = inject(SelectedFacade)
  private readonly panelsFacade = inject(PanelsFacade)
  private readonly stringsFacade = inject(StringsFacade)
  private linksPathService = inject(LinksPathService)
  private gridStore = inject(GridStoreService)
  private stringsStore = inject(StringsStoreService)
  private selectedStore = inject(SelectedStoreService)
  private panelsStore = inject(PanelsStoreService)

  async create(stringName: string) {
    const project = await this.projectsFacade.projectFromRoute
    console.log(project)
    if (!project) {
      return
    }
    const string = new StringModel({
      projectId: project.id,
      name: stringName,
      color: '',
      parallel: false,
    })
    this.stringsStore.dispatch.createString(string)
    return string
  }

  async select(stringId: string) {
    this.gridStore.dispatch.selectGridMode(GridMode.SELECT)
    const string = await this.stringsFacade.stringById(stringId)
    if (!string) return
    const panels = await this.panelsFacade.panelsByStringId(stringId)
    this.selectedStore.dispatch.selectString(string, panels)
    // this.linksPathService.orderPanelsInLinkOrderWithLinkAsync()
    // orderPanelsInLinkOrderWithLinkAsync
  }

  async addSelectedToNew(stringName: string) {
    const selectedPanelIds = await firstValueFrom(
      this.selectedStore.select.multiSelectIds$
        .pipe(combineLatestWith(this.panelsStore.select.allPanels$))
        .pipe(
          map(([multiSelectIds, panels]) => {
            return panels.filter((p) => multiSelectIds?.includes(p.id)).map((panels) => panels.id)
          }),
        ),
    )
    console.log(selectedPanelIds)
    if (!selectedPanelIds) {
      return
    }
    const string = await this.create(stringName)
    console.log(string)
    if (!(string instanceof StringModel)) {
      return
    }
    const selectedPanelUpdates = toUpdatePanelArray(selectedPanelIds, string.id)

    this.panelsStore.dispatch.updateManyPanels(selectedPanelUpdates)
    this.selectedStore.dispatch.clearSelected()

    // await this.select(string.id)
    return string
  }

  async addSelectedToExisting(stringId: string) {
    const selectedPanelIds = await firstValueFrom(
      combineLatest([
        this.selectedFacade.selectedIdWithType$,
        this.selectedFacade.multiSelectIds$,
        this.panelsFacade.allPanels$,
      ]).pipe(
        map(([selectedIdWithType, multiSelectIds, panels]) => {
          if (multiSelectIds) {
            return panels.filter((p) => multiSelectIds?.includes(p.id)).map((panels) => panels.id)
          }
          if (selectedIdWithType.singleSelectId && selectedIdWithType.type === BlockType.PANEL) {
            return [selectedIdWithType.singleSelectId]
          }
          return undefined
        }),
      ),
    )

    if (!selectedPanelIds) {
      return
    }

    const selectedPanelUpdates = toUpdatePanelArray(selectedPanelIds, stringId)
    this.panelsStore.dispatch.updateManyPanels(selectedPanelUpdates)
    return
  }

  async updateString(stringId: string, changes: Partial<StringModel>) {
    const update: Update<StringModel> = {
      id: stringId,
      changes,
    }

    this.stringsStore.dispatch.update(update)

    // return this.eventFactory.action({ action: 'UPDATE_PANEL', data: { update } })
  }

  async delete(stringId: string) {
    this.stringsStore.dispatch.delete(stringId)
    return stringId
  }
}
