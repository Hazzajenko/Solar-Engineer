import { DragDropModule } from '@angular/cdk/drag-drop'
import { AsyncPipe, NgClass, NgIf, NgStyle, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core'

import { MatDialog, MatDialogConfig } from '@angular/material/dialog'

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { LinksFactory, PanelsService, StringsService } from '@grid-layout/data-access/services'

import { PanelLinkComponent } from '@grid-layout/feature/blocks/shared-ui'

import { LetModule } from '@ngrx/component'
import { LinksFacade, PanelsFacade, SelectedFacade, StringsFacade } from '@project-id/data-access/facades'
import { PanelModel, StringModel } from '@shared/data-access/models'
import { EditStringDialog } from 'libs/grid-layout/feature/blocks/block-panel/src/lib/dialogs/edit-string.dialog'
import {
  ExistingStringsDialog,
} from 'libs/grid-layout/feature/blocks/block-panel/src/lib/dialogs/existing-strings.dialog'
import { PanelNgModel } from 'libs/grid-layout/feature/blocks/block-panel/src/lib/models/panel-ng.model'

import { firstValueFrom, Observable } from 'rxjs'


@Component({
  selector: 'app-panel-menu',
  templateUrl: './panel-menu.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    MatTooltipModule,
    NgStyle,
    NgIf,
    AsyncPipe,
    LetModule,
    MatMenuModule,
    NgTemplateOutlet,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    PanelLinkComponent,
  ],
  standalone: true,
})
export class PanelMenuComponent {
  //region Services
  public stringsFactory = inject(StringsService)
  public panelsFactory = inject(PanelsService)
  @Input() panel!: PanelModel
  @Input() panelNg!: PanelNgModel
  panel$!: Observable<PanelModel | undefined>
  color$!: Observable<string | undefined>
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  private panelsFacade = inject(PanelsFacade)
  private stringsFacade = inject(StringsFacade)
  private linksFacade = inject(LinksFacade)
  private linksFactory = inject(LinksFactory)
  private selectedFacade = inject(SelectedFacade)
  private snackBar = inject(MatSnackBar)
  private dialog = inject(MatDialog)
  private _id!: string


  //region Component Functions
  async selectString(panel: PanelModel) {
    await this.stringsFactory.select(panel.stringId)
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
    await this.panelsFactory.deletePanel(panelId)
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
    const amountOfStrings = await this.stringsFacade.totalStrings()
    const newStringName = `STRING_${amountOfStrings + 1}`
    const result = await this.stringsFactory.addSelectedToNew(newStringName)
    if (result instanceof StringModel) {
      this.snack(`Created and selected new string ${result.name}`)
    }
  }


  async addSelectedToExistingString() {
    const dialog = this.dialog.open(ExistingStringsDialog)
    //TODO edit this for func
    const result = await firstValueFrom(dialog.afterClosed())
    if (result instanceof StringModel) {
      this.snack(`Created and selected new string ${result.name}`)
    }
  }

  async deleteSelectedString(stringId: string) {
    await this.stringsFactory.delete(stringId)
    this.snack(`String ${stringId} deleted`)
  }

  async rotatePanel(panel: PanelModel) {
    const rotation = panel.rotation === 0 ? 1 : 0
    await this.panelsFactory.updatePanel(panel.id, { rotation })
  }

  async deletePanelLink(panelId: string, link: 'POSITIVE' | 'NEGATIVE') {
    await this.linksFactory.deleteLink(panelId, link)
  }

  async rotateSelected(rotation: number) {
    await this.panelsFactory.rotateSelectedPanels(rotation)
  }

  async removeFromString(panel: PanelModel) {
    await this.panelsFactory.updatePanel(panel.id, { stringId: 'undefined' })
  }

  //endregion

  private snack(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
    })
  }
}
