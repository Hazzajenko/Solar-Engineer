import { inject, Injectable } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { GlobalFactory } from '@grid-layout/data-access/utils'
import { GlobalFacade } from '@project-id/data-access/facades'
import { PanelModel, StringModel } from '@shared/data-access/models'
import { EditStringDialog } from 'libs/grid-layout/feature/blocks/block-panel/src/lib/dialogs/edit-string.dialog'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class BlockPanelService {
  private facade = inject(GlobalFacade)
  private factory = inject(GlobalFactory)
  private snackBar = inject(MatSnackBar)
  private dialog = inject(MatDialog)

  async selectString(panel: PanelModel) {
    await this.factory.strings.select(panel.stringId)
  }

  async editString(panel: PanelModel) {
    const dialogConfig = new MatDialogConfig()

    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true

    dialogConfig.data = {
      stringId: panel.stringId,
    }

    const dialog = this.dialog.open(EditStringDialog, dialogConfig)
    const result = await firstValueFrom(dialog.afterClosed())
    if (result instanceof StringModel) {
      this.snack(`Edited string ${result.name}`)
    }
  }

  async deletePanel(panelId: string) {
    await this.factory.panels.delete(panelId)
  }

  async createNewStringWithSelected() {
    /*    const dialog = this.dialog.open(NewStringDialog, {
          height: '250',
          width: '250',
        })

        const result = await firstValueFrom(dialog.afterClosed())
        if (result instanceof StringModel) {
          this.snack(`Created and selected new string ${result.name}`)
        }*/
    //TODO change this back to dialog
    const amountOfStrings = await this.facade.strings.totalStrings()
    const newStringName = `STRING_${amountOfStrings + 1}`
    const result = await this.factory.strings.addSelectedToNew(newStringName)
    if (result instanceof StringModel) {
      this.snack(`Created and selected new string ${result.name}`)
    }
  }


  /*  async addSelectedToExistingString() {
      const dialog = this.dialog.open(ExistingStringsDialog)
      //TODO edit this for func
      const result = await firstValueFrom(dialog.afterClosed())
      if (result instanceof StringModel) {
        this.snack(`Created and selected new string ${result.name}`)
      }
    }*/

  async deleteSelectedString(stringId: string) {
    await this.factory.strings.delete(stringId)
    this.snack(`String ${stringId} deleted`)
  }

  async rotatePanel(panel: PanelModel) {
    const rotation = panel.rotation === 0 ? 1 : 0
    await this.factory.panels.update(panel.id, { rotation })
  }

  async deletePanelLink(panelId: string, link: 'POSITIVE' | 'NEGATIVE') {
    await this.factory.links.deleteLink(panelId, link)
  }

  async rotateSelected(rotation: number) {
    await this.factory.panels.rotateSelected(rotation)
  }

  async removeFromString(panel: PanelModel) {
    await this.factory.panels.update(panel.id, { stringId: 'undefined' })
  }

  private snack(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
    })
  }
}
