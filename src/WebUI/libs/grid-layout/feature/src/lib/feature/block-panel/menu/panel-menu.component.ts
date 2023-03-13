import { DragDropModule } from '@angular/cdk/drag-drop'
import {
  AsyncPipe,
  NgClass,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgTemplateOutlet,
} from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core'

import { MatDialog, MatDialogConfig } from '@angular/material/dialog'

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTooltipModule } from '@angular/material/tooltip'
import {
  LinksFacade,
  LinksFactory,
  PanelsEventService,
  PanelsFacade,
  SelectedFacade,
  StringsEventService,
  StringsFacade,
} from '@grid-layout/data-access'

import { PanelLinkComponent } from '../../shared-ui/panel-link/panel-link.component'

import { LetModule } from '@ngrx/component'
import { PanelModel, StringModel } from '@shared/data-access/models'
import { EditStringDialog, ExistingStringsDialog } from '../dialogs'

import { firstValueFrom, Observable } from 'rxjs'
import { PanelComponentState } from '../models/panel-component.state'

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
  public stringsFactory = inject(StringsEventService)
  public panelsFactory = inject(PanelsEventService)
  // @Input() panel!: PanelModel
  // @Input() panelNg!: PanelNgModel
  @Input() panelComponentState!: PanelComponentState
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
  }

  //endregion

  private snack(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
    })
  }
}
