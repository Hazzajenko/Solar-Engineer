import { inject, Injectable } from '@angular/core'
import { UndefinedString } from '@shared/data-access/models'
import { UpdateStr } from '@ngrx/entity/src/models'
import { DesignStringFactory, DesignStringModel } from '../types'
import { StringsStoreService } from '@design-app/feature-string'
import { SelectedStoreService } from '@design-app/feature-selected'
import { DesignEntityType } from '@design-app/shared'
import { DesignPanelModel, PanelsStoreService } from '@design-app/feature-panel'

@Injectable({
  providedIn: 'root',
})
export class StringsFactoryService {
  private _stringsStore = inject(StringsStoreService)
  private _panelsStore = inject(PanelsStoreService)
  private _selectedStore = inject(SelectedStoreService)

  async create(stringName: string) {
    const string = DesignStringFactory.create(stringName)
    this._stringsStore.dispatch.createString(string)
    return string
  }

  createWithPanels(stringName: string, panelIds: string[]) {
    const string = DesignStringFactory.create(stringName)
    this._stringsStore.dispatch.createStringWithPanels(string, panelIds)
    return string
  }

  async select(stringId: string) {
    const string = await this._stringsStore.select.stringById(stringId)
    if (!string) return
    if (string.name === UndefinedString) {
      console.log('select string undefined')
      return
    }
    // const panels = await this._panelsStore.select.panelsByStringId(stringId)
    this._selectedStore.dispatch.selectString(string.id)
    // this.linksPathService.orderPanelsInLinkOrderWithLinkAsync()
    // orderPanelsInLinkOrderWithLinkAsync
  }

  async addSelectedToNew(stringName: string) {
    const selectedPanels = await this._selectedStore.select.multiSelectedEntitiesByType(DesignEntityType.Panel)
    if (!selectedPanels) {
      return
    }
    const selectedPanelIds = selectedPanels.map((p) => p.id)
    const string = this.createWithPanels(stringName, selectedPanelIds)
    this._selectedStore.dispatch.clearSelectedState()
    return string
  }

  async addSelectedToExisting(stringId: string) {
    /*    const selectedPanelIds = await firstValueFrom(
     combineLatest([
     this.selectedFacade.selectedIdWithType$,
     this.selectedFacade.multiSelectIds$,
     this.panelsFacade.allPanels$,
     ]).pipe(
     map(([selectedIdWithType, multiSelectIds, panels]) => {
     if (multiSelectIds) {
     return panels.filter((p) => multiSelectIds?.includes(p.id)).map((panels) => panels.id)
     }
     if (selectedIdWithType.singleSelectId && selectedIdWithType.type === BLOCK_TYPE.PANEL) {
     return [selectedIdWithType.singleSelectId]
     }
     return undefined
     }),
     ),
     )*/

    const selectedPanels = await this._selectedStore.select.multiSelectedEntitiesByType(DesignEntityType.Panel)
    if (!selectedPanels) {
      return
    }
    const selectedPanelIds = selectedPanels.map((p) => p.id)

    const selectedPanelUpdates = selectedPanelIds.map((panelId) => {
      const update: UpdateStr<DesignPanelModel> = {
        id:      panelId,
        changes: {
          stringId,
        },
      }
      return update
    })
    this._panelsStore.dispatch.updateManyPanels(selectedPanelUpdates)
    return
  }

  async updateString(stringId: string, changes: Partial<DesignStringModel>) {
    // const project = await this.projectsFacade.selectedProject()
    const update: UpdateStr<DesignStringModel> = {
      id: stringId,
      changes,
    }

    this._stringsStore.dispatch.updateString(update)

    // return this.eventFactory.action({ action: 'UPDATE_PANEL', data: { update } })
  }

  async delete(stringId: string) {
    this._stringsStore.dispatch.deleteString(stringId)
    return stringId
  }
}
