import { Directive, HostListener, inject } from '@angular/core'
import {
  GlobalFactory,
  GridFactory,
  MultiFactory,
  SelectedFactory,
  StringFactory,
} from '@grid-layout/data-access/utils'
import {
  GlobalFacade,
  GridFacade,
  MultiFacade,
  PanelsFacade,
  SelectedFacade,
  StringsFacade,
} from '@project-id/data-access/facades'
import { GridMode } from '@shared/data-access/models'
import { firstValueFrom } from 'rxjs'

@Directive({
  selector: '[appKeyMap]',
  standalone: true,
})
export class KeyMapDirective {
  private gridFacade = inject(GridFacade)

  private multiFacade = inject(MultiFacade)
  private selectedFacade = inject(SelectedFacade)
  private panelsFacade = inject(PanelsFacade)
  private gridFactory = inject(GridFactory)
  private selectedFactory = inject(SelectedFactory)
  private multiFactory = inject(MultiFactory)
  private stringsFacade = inject(StringsFacade)
  private stringFactory = inject(StringFactory)
  private factory = inject(GlobalFactory)
  private facade = inject(GlobalFacade)

  @HostListener('window:keyup', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    console.log(event)
    switch (event.key) {
      case 'Alt': {
        const multiState = await firstValueFrom(this.multiFacade.state$)
        if (multiState.locationStart && event.key === 'Alt') {
          this.multiFacade.clearMultiState()
        }
      }
        break
      case 's': {
        const selectedId = await this.selectedFacade.selectedId
        if (!selectedId) break

        const panel = await this.panelsFacade.panelById(selectedId)
        if (!panel) break

        await this.gridFactory.select(GridMode.SELECT)
        await this.selectedFactory.selectString(panel.stringId)

        break
      }
      case 'l': {
        const gridMode = await this.facade.grid.gridMode
        if (gridMode === GridMode.LINK) {
          this.facade.grid.selectGridMode(GridMode.SELECT)
          this.facade.links.clearLinkState()
          break
        }
        const isStringSelected = await this.facade.selected.selectedStringId
        if (!isStringSelected) break
        this.facade.grid.selectGridMode(GridMode.LINK)
        this.facade.selected.clearSingleSelected()

        break

      }
      case 'c':
        this.gridFacade.selectCreateMode()
        break
      case 'x': {
        const multiSelectIds = await this.selectedFacade.multiSelectIds
        if (!multiSelectIds) break
        const amountOfStrings = await this.stringsFacade.totalStrings()
        const newStringName = `S${amountOfStrings + 1}`
        // const newStringName = `STRING_${amountOfStrings + 1}`
        const result = await this.stringFactory.addSelectedToNew(newStringName)
        console.log(result)
        break
      }
      case 'Delete': {
        const singleAndMultiIds = await this.selectedFacade.singleAndMultiIds
        if (singleAndMultiIds.multiIds && singleAndMultiIds.multiIds.length > 0) {
          await this.multiFactory.deleteMany(singleAndMultiIds.multiIds)
          break
        }
        if (singleAndMultiIds.singleId) {
          await this.panelsFacade.deletePanel(singleAndMultiIds.singleId)
          break
        }
        break
      }
      case 'Escape':
        this.gridFacade.clearEntireGridState()
        break
    }
  }
}
