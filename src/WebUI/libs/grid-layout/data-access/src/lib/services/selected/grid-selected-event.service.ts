import { inject, Injectable } from '@angular/core'
import { GridPanelsStoreService, GridSelectedStoreService, GridStoreService, GridStringsStoreService } from '../'
import { GridMode } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class GridSelectedEventService {
  private gridStore = inject(GridStoreService)
  private selectedStore = inject(GridSelectedStoreService)
  private panelsStore = inject(GridPanelsStoreService)
  private stringsStore = inject(GridStringsStoreService)

  async selectString(stringId: string) {
    this.gridStore.dispatch.selectGridMode(GridMode.SELECT)
    const string = await this.stringsStore.select.stringById(stringId)
    if (!string) return
    const panels = await this.panelsStore.select.panelsByStringId(stringId)
    this.selectedStore.dispatch.selectString(string, panels)
  }

  async clearState() {
    this.selectedStore.dispatch.clearSelected()
    return
  }
}
