import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core'
import { PanelFactory, StringFactory } from '@grid-layout/data-access/utils'
import { combineLatestWith, map } from 'rxjs/operators'
import { NewStringDialog } from './dialogs/new-string.dialog'

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
import { MatTooltipModule } from '@angular/material/tooltip'

import { LetModule } from '@ngrx/component'

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { LinksFacade, PanelsFacade, SelectedFacade } from '@project-id/data-access/facades'

import { combineLatest, Observable } from 'rxjs'

import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { PanelLinkComponent } from '@grid-layout/feature/blocks/shared-ui'
import { PanelModel } from '@shared/data-access/models'
import { EditStringDialog } from './dialogs/edit-string.dialog'
import { ExistingStringsDialog } from './dialogs/existing-strings.dialog'
import { PanelDirective } from './directives/panel.directive'
import { PanelNgModel, SelectedPanelType } from './models/panel-ng.model'

@Component({
  selector: 'app-block-panel',
  templateUrl: './block-panel.component.html',
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
    PanelDirective,
  ],
  standalone: true,
})
export class BlockPanelComponent {
  private panelsFacade = inject(PanelsFacade)
  private linksFacade = inject(LinksFacade)
  private selectedFacade = inject(SelectedFacade)
  public stringFactory = inject(StringFactory)
  public panelFactory = inject(PanelFactory)
  panel$!: Observable<PanelModel | undefined>
  private _id!: string
  @Input() set id(id: string) {
    this._id = id
    this.panel$ = this.panelsFacade.panelById$(id)
  }
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger

  constructor(private dialog: MatDialog) {}

  // private dialog = inject(MatDialog)

  private isSelectedPanel$: Observable<SelectedPanelType> = this.selectedFacade.selectedId$.pipe(
    combineLatestWith(this.selectedFacade.selectMultiSelectIds$),
    map(([singleSelectId, multiSelectIds]) => {
      if (multiSelectIds?.includes(this._id)) {
        return SelectedPanelType.MULTI_SELECETED
      }
      if (singleSelectId === this._id) {
        return SelectedPanelType.SINGLE_SELECTED
      }
      return SelectedPanelType.NOT_SELECTED
    }),
  )

  private isSelectedPositiveTo$: Observable<boolean> =
    this.selectedFacade.selectSelectedPositiveTo$.pipe(
      map((positiveToId) => {
        if (positiveToId === this._id) {
          return true
        }
        return false
      }),
    )

  private isSelectedNegativeTo$: Observable<boolean> =
    this.selectedFacade.selectSelectedNegativeTo$.pipe(
      map((negativeToId) => {
        if (negativeToId === this._id) {
          return true
        }
        return false
      }),
    )

  private isSelectedString$: Observable<boolean> = this.selectedFacade.selectedStringId$.pipe(
    combineLatestWith(
      this.panelsFacade.allPanels$.pipe(
        map((panels) => panels.find((panel) => panel.id === this._id)),
        map((panel) => panel?.stringId),
      ),
    ),
    map(([selectedStringId, stringId]) => {
      if (selectedStringId === stringId) {
        return true
      }
      return false
    }),
  )

  private isToLinkId$: Observable<boolean> = this.linksFacade.toLinkId$.pipe(
    map((toLinkId) => {
      if (toLinkId === this._id) {
        return true
      }
      return false
    }),
  )
  public panelNg$: Observable<PanelNgModel> = combineLatest([
    this.isSelectedPanel$,
    this.isSelectedPositiveTo$,
    this.isSelectedNegativeTo$,
    this.isSelectedString$,
    this.isToLinkId$,
  ]).pipe(
    map(
      ([
        isSelectedPanel,
        isSelectedPositiveTo,
        isSelectedNegativeTo,
        isSelectedString,
        isPanelToJoin,
      ]) => {
        return {
          isSelectedPanel,
          isSelectedPositiveTo,
          isSelectedNegativeTo,
          isSelectedString,
          isPanelToLink: isPanelToJoin,
        } as PanelNgModel
      },
    ),
  )

  displayTooltip(isSelectedString: boolean, selectedStringTooltip?: string): string {
    if (isSelectedString) {
      return <string>selectedStringTooltip
    }
    return ''
  }

  onRightClick(event: MouseEvent, panel?: PanelModel | null) {
    event.preventDefault()
    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { panel }
    this.matMenuTrigger.openMenu()
  }

  selectString(panel: PanelModel) {
    this.stringFactory.select(panel.stringId)
  }

  editString(panel: PanelModel) {
    const dialogConfig = new MatDialogConfig()

    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true

    dialogConfig.data = {
      stringId: panel.stringId,
    }

    this.dialog.open(EditStringDialog, dialogConfig)
  }

  deletePanel(panelId: string) {
    this.panelFactory.delete(panelId)
  }

  createNewStringWithSelected() {
    this.dialog.open(NewStringDialog)
  }

  addSelectedToExistingString() {
    this.dialog.open(ExistingStringsDialog)
  }

  deleteSelectedString(stringId: string) {
    this.stringFactory.delete(stringId)
  }

  rotatePanel(panel: PanelModel) {
    const rotation = panel.rotation === 0 ? 1 : 0
    this.panelFactory.update(panel.id, { rotation })
  }

  deletePanelLink(panel: PanelModel, linkId: string) {
    throw new Error()
  }

  async rotateSelected(rotation: number) {
    this.panelFactory.rotateSelected(rotation)
  }

  removeFromString(panel: PanelModel) {
    this.panelFactory.update(panel.id, { stringId: 'undefined' })
  }
}
