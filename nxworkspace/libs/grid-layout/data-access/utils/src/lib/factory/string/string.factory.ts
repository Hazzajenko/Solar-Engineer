import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import {
  GridFacade,
  PanelsFacade,
  SelectedFacade,
  StringsFacade,
} from '@project-id/data-access/facades'
import { LinksPathService } from '@project-id/utils'
import { ProjectsFacade } from '@projects/data-access/facades'
import { BlockType, GridMode, PanelModel, StringModel } from '@shared/data-access/models'
import { getRandomColor } from 'libs/grid-layout/data-access/utils/src/lib/get-random-color'
import { SelectedFactory } from '../selected/selected.factory'
import { combineLatest, combineLatestWith, firstValueFrom, map } from 'rxjs'
import { GridEventFactory } from '../../grid.factory'
import { toUpdatePanelArray } from './update-panel-map'

@Injectable({
  providedIn: 'root',
})
export class StringFactory {
  private readonly eventFactory = inject(GridEventFactory)
  private readonly store = inject(Store)
  // private readonly eventFactory = inject(GridEvent)
  private readonly projectsFacade = inject(ProjectsFacade)
  private readonly gridFacade = inject(GridFacade)
  private readonly selectedFacade = inject(SelectedFacade)
  private readonly panelsFacade = inject(PanelsFacade)
  private readonly stringsFacade = inject(StringsFacade)
  private linksPathService = inject(LinksPathService)

  async create(stringName: string) {
    const project = await this.projectsFacade.projectFromRoute
    console.log(project)
    if (!project) {
      return this.eventFactory.error('project undefined')
    }
    const string = new StringModel({
      projectId: project.id,
      name: stringName,
      color: getRandomColor(),
      parallel: false,
    })
    this.stringsFacade.createString(string)
    return string
  }

  async select(stringId: string) {
    this.gridFacade.selectGridMode(GridMode.SELECT)
    const string = await this.stringsFacade.stringById(stringId)
    if (!string) return
    const panels = await this.panelsFacade.panelsByStringId(stringId)
    this.selectedFacade.selectString(string, panels)
    // this.linksPathService.orderPanelsInLinkOrderWithLinkAsync()
    // orderPanelsInLinkOrderWithLinkAsync
  }

  async addSelectedToNew(stringName: string) {
    const selectedPanelIds = await firstValueFrom(
      this.selectedFacade.multiSelectIds$
        .pipe(combineLatestWith(this.panelsFacade.allPanels$))
        .pipe(
          map(([multiSelectIds, panels]) => {
            return panels.filter((p) => multiSelectIds?.includes(p.id)).map((panels) => panels.id)
          }),
        ),
    )
    console.log(selectedPanelIds)
    if (!selectedPanelIds) {
      return this.eventFactory.error('addSelectedToNewString, !selectedPanels')
    }
    const string = await this.create(stringName)
    console.log(string)
    if (!(string instanceof StringModel)) {
      return
    }
    const selectedPanelUpdates = toUpdatePanelArray(selectedPanelIds, string.id)

    this.panelsFacade.updateManyPanels(selectedPanelUpdates)
    this.selectedFacade.clearSelected()

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
    this.panelsFacade.updateManyPanels(selectedPanelUpdates)
    return
  }

  async updateString(stringId: string, changes: Partial<StringModel>) {
    const update: Update<StringModel> = {
      id: stringId,
      changes,
    }

    this.stringsFacade.update(update)

    // return this.eventFactory.action({ action: 'UPDATE_PANEL', data: { update } })
  }

  async delete(stringId: string) {
    this.stringsFacade.delete(stringId)
    return stringId
  }
}
