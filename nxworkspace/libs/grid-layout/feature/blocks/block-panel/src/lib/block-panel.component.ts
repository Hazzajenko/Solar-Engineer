import { DragDropModule } from '@angular/cdk/drag-drop'
import { AsyncPipe, NgClass, NgIf, NgStyle, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core'

import { MatDialog, MatDialogConfig } from '@angular/material/dialog'

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { LinkFactory, PanelFactory, StringFactory } from '@grid-layout/data-access/utils'
import { PanelLinkComponent } from '@grid-layout/feature/blocks/shared-ui'


import { LetModule } from '@ngrx/component'
import { LinksFacade, PanelsFacade, SelectedFacade, StringsFacade } from '@project-id/data-access/facades'
import {
  BlockModel,
  PanelPathModel,
  PanelModel,
  StringModel,
  StringLinkPathModel,
  SelectedPathModel,
} from '@shared/data-access/models'
import { PanelMenuComponent } from 'libs/grid-layout/feature/blocks/block-panel/src/lib/menu/panel-menu.component'
import { PathsFacade } from 'libs/project-id/data-access/facades/src/lib/paths.facade'

import { combineLatest, firstValueFrom, Observable, of, retry, switchMap } from 'rxjs'

import { combineLatestWith, map } from 'rxjs/operators'
import { EditStringDialog } from './dialogs/edit-string.dialog'
import { ExistingStringsDialog } from './dialogs/existing-strings.dialog'
import { NewStringDialog } from './dialogs/new-string.dialog'
import { PanelDirective } from './directives/panel.directive'
import { PanelNgModel, SelectedPanelVal, StringSelectedVal } from './models/panel-ng.model'

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
    PanelMenuComponent,
  ],
  standalone: true,
})
export class BlockPanelComponent {
  //region Services
  public stringFactory = inject(StringFactory)
  public panelFactory = inject(PanelFactory)
  panel$!: Observable<PanelModel | undefined>
  color$!: Observable<string | undefined>
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  private panelsFacade = inject(PanelsFacade)
  private stringsFacade = inject(StringsFacade)
  private linksFacade = inject(LinksFacade)
  private pathsFacade = inject(PathsFacade)
  private linkFactory = inject(LinkFactory)
  private selectedFacade = inject(SelectedFacade)
  private snackBar = inject(MatSnackBar)
  private dialog = inject(MatDialog)
  private _id!: string


  //endregion
  @Input() set id(id: string) {
    this._id = id
    this.panel$ = this.panelsFacade.panelById$(id)
  }

  constructor() {
    console.log('render')
  }


  //region Observables
  private isSelectedPanel$: Observable<SelectedPanelVal> = this.selectedFacade.selectedId$.pipe(
    combineLatestWith(this.selectedFacade.multiSelectIds$),
    map(([singleSelectId, multiSelectIds]) => {
      if (multiSelectIds?.includes(this._id)) {
        return SelectedPanelVal.MULTI_SELECTED
      }
      if (singleSelectId === this._id) {
        return SelectedPanelVal.SINGLE_SELECTED
      }
      return SelectedPanelVal.NOT_SELECTED
    }),
  )
  private isSelectedPositiveTo$: Observable<boolean> =
    this.selectedFacade.selectSelectedPositiveTo$.pipe(
      map((positiveToId) => {
        return positiveToId === this._id
      }),
    )
  private isSelectedNegativeTo$: Observable<boolean> =
    this.selectedFacade.selectSelectedNegativeTo$.pipe(
      map((negativeToId) => {
        return negativeToId === this._id
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
      return selectedStringId === stringId

    }),
  )
  private stringSelected$: Observable<StringSelectedVal> = this.selectedFacade.selectedStringId$.pipe(
    combineLatestWith(
      this.panelsFacade.allPanels$.pipe(
        map((panels) => panels.find((panel) => panel.id === this._id)),
        map((panel) => panel?.stringId),
      ),
    ),
    map(([selectedStringId, stringId]) => {
      if (selectedStringId === stringId) {
        return StringSelectedVal.SELECTED
      }
      if (selectedStringId && selectedStringId !== stringId) {
        return StringSelectedVal.OTHER_SELECTED
      }
      return StringSelectedVal.NOT_SELECTED
    }),
  )

  selectedStringTooltip$ = this.selectedFacade.selectedStringTooltip$.pipe(
    combineLatestWith(this.isSelectedString$),
    map(([stringTooltip, isSelectedString]) => {
      if (!isSelectedString) return undefined
      return stringTooltip
    }),
  )
  panelStringColor$ = this.panelsFacade.allPanels$.pipe(
    map((panels) => panels.find((panel) => panel.id === this._id)),
    map((panel) => panel?.stringId),
    switchMap(stringId => this.stringsFacade.stringById$(stringId)),
    map((string) => {
      if (!string) {
        return undefined
      }
      return string.color
    }),
  )

  panelStringName$: Observable<string | undefined> = this.panelsFacade.allPanels$.pipe(
    map((panels) => panels.find((panel) => panel.id === this._id)),
    map((panel) => panel?.stringId),
    switchMap(stringId => this.stringsFacade.stringById$(stringId)),
    map((string) => {
      if (!string) {
        return undefined
      }
      return string.name
    }),
  )

  /*  panelLinkPath$: Observable<PanelPathModel | undefined> = this.pathsFacade.pathByPanelId$(this._id).pipe(
      combineLatestWith(this.isSelectedString$),
      map(([path, isSelectedString]) => {
        if (!isSelectedString) throw new Error('!isSelectedString')
        if (!path) throw new Error('!path')
        return path.path
      }),
      retry(2),
    )*/
  panelLinkPath$: Observable<PanelPathModel | undefined> = this.pathsFacade.allPaths$.pipe(
    combineLatestWith(this.isSelectedString$),
    map(([paths, isSelectedString]) => {
      if (!isSelectedString) return undefined
      return paths.find(path => path.panelId === this._id)
    }),
    map(path => path?.panelPath),
  )

  /*  panelLinkPath$: Observable<PanelPathModel | undefined> = this.selectedFacade.selectedStringPathMap$.pipe(
      combineLatestWith(this.isSelectedString$),
      map(([pathMap, isSelectedString]) => {
        if (!isSelectedString) return undefined
        if (!pathMap) return undefined
        return pathMap.get(this._id)
      }),
    )*/

  selectedPanelLinkPath$: Observable<SelectedPathModel | undefined> = this.pathsFacade.selectedPanelLinkPath$.pipe(
    map((selectedPath) => {
      if (!selectedPath) return undefined
      return selectedPath.panelPaths.find(panel => panel.panelId === this._id)
    }),
  )
  private isToLinkId$: Observable<boolean> = this.linksFacade.toLinkId$.pipe(
    map((toLinkId) => {
      return toLinkId === this._id
    }),
  )

  public panelNg$: Observable<PanelNgModel> = combineLatest([
    this.isSelectedPanel$,
    this.isSelectedPositiveTo$,
    this.isSelectedNegativeTo$,
    this.panelStringColor$,
    this.isToLinkId$,
    this.stringSelected$,
    this.panelLinkPath$,
    // this.panelLinkPath$,
    this.selectedPanelLinkPath$,
  ]).pipe(
    map(
      ([
         isSelectedPanel,
         isSelectedPositiveTo,
         isSelectedNegativeTo,
         stringColor,
         isPanelToLink,
         stringSelected,
         panelLinkPath,
         selectedPanelLinkPath,
       ]) => {
        return {
          isSelectedPanel,
          isSelectedPositiveTo,
          isSelectedNegativeTo,
          stringColor,
          isPanelToLink,
          stringSelected,
          panelLinkPath,
          selectedPanelLinkPath,
        } as PanelNgModel
      },
    ),
  )

  //endregion


  //region Component Functions
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

  //endregion

  private snack(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
    })
  }
}
