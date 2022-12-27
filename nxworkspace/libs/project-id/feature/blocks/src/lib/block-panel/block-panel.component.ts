import { ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewChild } from '@angular/core'

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

import { Store } from '@ngrx/store'

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { PanelsFacade } from '@project-id/data-access/store'

import { Observable } from 'rxjs'

import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { PanelModel } from '@shared/data-access/models'
import { AppState } from '@shared/data-access/store'
import { PanelLinkComponent } from '../ui'
import { PanelDirective } from './directives/panel.directive'
import { GetPanelAsyncPipe } from './get-panel-async.pipe'

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
    GetPanelAsyncPipe,
  ],
  standalone: true,
})
export class BlockPanelComponent {
  private panelsFacade = inject(PanelsFacade)
  panel$!: Observable<PanelModel | undefined>
    @Input() set id(id: string) {
    this.panel$ = this.panelsFacade.panelById(id)
  }
  // @Input() id!: string

  // @Input() panel$!: Observable<PanelModel | undefined>

  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger

  private store = inject(Store<AppState>)
  private dialog = inject(MatDialog)


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
    /*     this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
    this.store.dispatch(SelectedStateActions.selectType({ objectType: TypeModel.STRING }))
    this.store.dispatch(SelectedStateActions.selectString({ stringId: panel.stringId })) */
  }

  editString(panel: PanelModel) {
    const dialogConfig = new MatDialogConfig()

    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true

    dialogConfig.data = {
      stringId: panel.stringId,
    }

    // this.dialog.open(EditStringDialog, dialogConfig)
  }

  deletePanel(panel: PanelModel) {
    // this.panelsEntity.delete(panel)
  }

  async panelAction(panel?: PanelModel | null, shiftKey?: boolean) {
    if (!panel) {
      return console.error('err panelAction !panel')
    }

    // const gridMode = await firstValueFrom(this.store.select(selectGridMode))

    //     switch (gridMode) {
    //       case GridMode.LINK:
    //         break
    //       case GridMode.DELETE:
    //         this.panelsEntity.delete(panel)
    //         break
    //       case GridMode.SELECT:
    //  /*        const isStringSelected = await firstValueFrom(this.isSelectedString$)
    //         if (isStringSelected) {
    //           console.log('s')
    //           this.store.dispatch(
    //             SelectedStateActions.selectPanelWhenStringSelected({ panelId: panel.id }),
    //           )
    //         } else {
    //           if (shiftKey) {
    //             this.store.dispatch(
    //               SelectedStateActions.addPanelToMultiselect({
    //                 panelId: panel.id,
    //               }),
    //             )
    //           } else {
    //             this.store.dispatch(SelectedStateActions.selectPanel({ panelId: panel.id }))
    //           }
    //         } */

    //         break
    //       case GridMode.CREATE:
    //         /* const createMode = await firstValueFrom(this.store.select(selectCreateMode))

    //         if (createMode === TypeModel.RAIL) {
    //           return
    //         } else {
    //           this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
    //           if (shiftKey) {
    //             this.store.dispatch(
    //               SelectedStateActions.addPanelToMultiselect({
    //                 panelId: panel.id,
    //               }),
    //             )
    //           } else {
    //             this.store.dispatch(SelectedStateActions.selectPanel({ panelId: panel.id }))
    //           }
    //         }
    //  */
    //         break
    //       case GridMode.MULTICREATE:
    //         break
    //       default:
    //         this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
    //         if (shiftKey) {
    //           this.store.dispatch(
    //             SelectedStateActions.addPanelToMultiselect({
    //               panelId: panel.id,
    //             }),
    //           )
    //         } else {
    //           this.store.dispatch(SelectedStateActions.selectPanel({ panelId: panel.id }))
    //         }

    //         break
    //     }
  }

  createNewStringWithSelected() {
    // this.dialog.open(NewStringDialog)
  }

  addSelectedToExistingString() {
    // this.dialog.open(ExistingStringsDialog)
  }

  deleteSelectedString(stringId: string) {
    /* firstValueFrom(
      this.store
        .select(selectSelectedState)
        .pipe(
          combineLatestWith(
            this.stringsEntity.entities$.pipe(
              map((strings) => strings.find((s) => s.id === stringId)),
            ),
          ),
        ),
    ).then(([selected, selectedString]) => {
      if (selected.type === TypeModel.STRING) {
        if (selected.singleSelectId === selectedString?.id) {
          this.stringsEntity.delete(selectedString!)
        }
      }
    }) */
  }

  rotatePanel(panel: PanelModel) {
    const update: Partial<PanelModel> = {
      ...panel,
      rotation: panel.rotation === 0 ? 1 : 0,
    }
    // this.panelsEntity.update(update)
  }

  deletePanelLink(panel: PanelModel, linkId: string) {
    /*     this.linksEntity.delete(linkId)
    firstValueFrom(
      this.store
        .select(selectSelectedStringId)
        .pipe(map((selectedId) => selectedId === panel.stringId)),
    ).then((isInSelectedString) => {
      if (isInSelectedString) {
        this.store.dispatch(SelectedStateActions.clearSelectedPanelLinks())
      }
    }) */
  }

  async rotateSelected(rotation: number) {
    /* const multiSelectIds = await firstValueFrom(this.store.select(selectMultiSelectIds))
    if (multiSelectIds) {
      const panelsToUpdate = await firstValueFrom(
        this.panelsEntity.entities$.pipe(
          map((panels) => panels.filter((panel) => multiSelectIds.includes(panel.id))),
          map((selectedPanels) =>
            selectedPanels.map((panel) => {
              return {
                ...panel,
                rotation,
              } as Partial<PanelModel>
            }),
          ),
        ),
      )

      this.panelsEntity.updateManyInCache(panelsToUpdate)
    } */
  }

  removeFromString(panel: PanelModel) {
    /*     const update: Partial<PanelModel> = {
      ...panel,
      stringId: 'undefined',
    }

    this.panelsEntity.update(update) */
  }

  markPanelAsDisconnectionPoint(panel: PanelModel) {
    // const update = panel.markAsDisconnectionPoint()
  }

  getBackgroundColor(
    stringColor: string,
    pathMap: Map<string, { link: number; count: number; color: string }>,
    isInSelection: boolean,
    positiveTo: boolean,
    negativeTo: boolean,
    isPanelToJoin: boolean,
    isOtherStringSelected: boolean,
  ) {
    /*     if (isOtherStringSelected) {
      return '#819CA9'
    }
    if (positiveTo) {
      return SoftColor.SoftRed
    }
    if (negativeTo) {
      return SoftColor.SoftCyan
    }
    if (isPanelToJoin) {
      return VibrantColor.VibrantPurple
    }
    if (pathMap) {
      const thisPanelPath = pathMap.get(this.id)
      if (thisPanelPath) {
        return thisPanelPath.color
      }
    }

    if (isInSelection) {
      // return '#ff1c24'
      // return '#00E6DF'
      // return VibrantColors.VibrantGreen
      // return `hwb(0 20% 0%)`
    }
    if (stringColor.length > 0) {
      // return `hwb(0 0% 20%)`
      // return DarkColors.SoftCyan
      // return DarkColors.Purple
      return stringColor
    } else {
    }
    return '' */
  }

  getBoxShadow(
    stringColor: string,
    pathMap: Map<string, { link: number; count: number; color: string }>,
    isInSelection: boolean,
    isSelectedString: boolean,
  ) {
    /*    if (isInSelection && isSelectedString) {
      return `0 0 0 1px red, 0 0 0 0.5px ${DarkColor.SoftCyan}`
    }*/
    if (isInSelection) {
      // return `0 0 0 2px ${VibrantColors.VibrantOrange}`
      // return `0 0 0 2px ${DarkColors.SoftCyan}`
      // return `0 0 0 2px ${LightColors.LightBlue}`
      return `0 0 0 1px red`
      // return `0 0 0 1px red`
      // return `0 0 0 1px ${VibrantColors.VibrantGreen}`
      // border: 2px solid $borderColor;
      // return '#00E6DF'

      // return VibrantColors.VibrantGreen
      // return `hwb(0 20% 0%)`
    }
    if (isSelectedString) {
      // return `rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px`
      // return `rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset`
      // return `0 0 0 0.5px ${DarkColor.SoftOrange}`
    }
    if (stringColor) {
      // return `0 0 0 1px ${stringColor}`
      // return `hwb(0 0% 20%)`
      // return stringColor
      // return
    }
    return ''
  }
}
