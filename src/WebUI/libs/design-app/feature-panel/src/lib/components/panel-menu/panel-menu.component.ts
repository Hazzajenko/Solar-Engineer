import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

import { MatMenuModule } from '@angular/material/menu'
import { PanelComponentStore } from '../panel-component.store'
import { ShowSvgComponent } from '@shared/ui'
import { SelectedPanelState } from '../../types'

@Component({
  selector:        'app-panel-menu[panelId][selected]',
  templateUrl:     './panel-menu.component.html',
  styles:          [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:         [
    MatMenuModule,
    CommonModule,
    ShowSvgComponent,
  ],
  standalone:      true,
})
export class PanelMenuComponent {
  // public store = inject(PanelComponentStore)
  @Input() panelId!: string
  @Input() selected!: SelectedPanelState
  @Input() store!: PanelComponentStore
  @Output() closeMenu = new EventEmitter<boolean>()

  // TODO: implement
  /* async selectString(panel: PanelModel) {
   await this.stringsFactory.select(panel.stringId)
   }

   async editString(stringId: string) {
   // async editString(panel: PanelModel) {
   const dialogConfig = new MatDialogConfig()

   dialogConfig.disableClose = true
   dialogConfig.autoFocus = true

   dialogConfig.data = {
   stringId: stringId,
   }

   const dialog = this.dialog.open(EditStringDialog, dialogConfig)
   const result = await firstValueFrom(dialog.afterClosed())
   if (result instanceof StringModel) {
   this.snack(`Edited string ${result.name}`)
   }
   }


   async createNewStringWithSelected() {
   /   const dialog = this.dialog.open(NewStringDialog, {
   height: '250',
   width: '250',
   })

   const result = await firstValueFrom(dialog.afterClosed())
   if (result instanceof StringModel) {
   this.snack(`Created and selected new string ${result.name}`)
   }*!/
   const amountOfStrings = await this.stringsFacade.totalStrings()
   const newStringName = `STRING_${amountOfStrings + 1}`
   const result = await this.stringsFactory.addSelectedToNew(newStringName)
   if (result instanceof StringModel) {
   this.snack(`Created and selected new string ${result.name}`)
   }
   }

   async addSelectedToExistingString() {
   const dialog = this.dialog.open(ExistingStringsDialog)
   const result = await firstValueFrom(dialog.afterClosed())
   if (result instanceof StringModel) {
   this.snack(`Created and selected new string ${result.name}`)
   }
   }

   async deleteSelectedString(stringId: string) {
   await this.stringsFactory.delete(stringId)
   this.snack(`String ${stringId} deleted`)
   }

   async rotatePanel(panelId: string, panelRotation: number) {
   // async rotatePanel(panel: PanelModel) {
   const rotation = panelRotation === 0 ? 1 : 0
   await this.panelsFactory.updatePanel(panelId, { rotation })
   }

   async deletePanelLink(panelId: string, link: 'POSITIVE' | 'NEGATIVE') {
   await this.linksFactory.deleteLink(panelId, link)
   }

   async rotateSelected(rotation: number) {
   await this.panelsFactory.rotateSelectedPanels(rotation)
   }

   async removeFromString(panel: PanelModel) {
   await this.panelsFactory.updatePanel(panel.id, { stringId: 'undefined' })
   }*/
  protected readonly SelectedPanelState = SelectedPanelState
}
