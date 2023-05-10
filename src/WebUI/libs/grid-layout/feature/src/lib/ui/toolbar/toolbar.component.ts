import { LetDirective } from '@ngrx/component'
import { GridFacade, GridSelectedFacade, GridStoreService, GridStringsFacade, UiFacade, UiStoreService } from '@grid-layout/data-access'
import { map, Observable, switchMap } from 'rxjs'
import { MatButtonModule } from '@angular/material/button'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'

import { LogoNameV3Component } from '@shared/ui/logo'
import { MatMenuModule } from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon'
import { GridMode } from '@shared/data-access/models'

@Component({
  selector:    'app-toolbar',
  standalone:  true,
  imports:     [
    CommonModule,
    LogoNameV3Component,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    LetDirective,
  ],
  templateUrl: './toolbar.component.html',
  styles:      [],
})
export class ToolbarComponent {
  private gridFacade = inject(GridFacade)
  private gridStore = inject(GridStoreService)
  private selectedFacade = inject(GridSelectedFacade)
  private stringsFacade = inject(GridStringsFacade)
  private uiFacade = inject(UiFacade)
  private uiStore = inject(UiStoreService)
  // private store = inject(Store)
  gridMode$: Observable<GridMode> = this.gridFacade.gridMode$
  keymap$ = this.uiStore.select.isKeyMapEnabled$
  selectedStringName$ = this.selectedFacade.selectedStringId$.pipe(
    switchMap((stringId) =>
      this.stringsFacade.stringById$(stringId)
        .pipe(
          map((string) => {
            if (!string) return undefined
            return string.name
          }),
        ),
    ),
  )

  selectMode(gridMode: GridMode) {
    switch (gridMode) {
      case GridMode.CREATE:
        return this.gridStore.dispatch.selectCreateMode()
      case GridMode.SELECT:
        return this.gridStore.dispatch.selectSelectMode()

      case GridMode.LINK:
        return this.gridStore.dispatch.selectLinkMode()

      case GridMode.DELETE:
        return this.gridStore.dispatch.selectDeleteMode()
      default:
        return
    }
  }

  toggleKeymap() {
    this.uiStore.dispatch.toggleKeyMap()
  }
}
