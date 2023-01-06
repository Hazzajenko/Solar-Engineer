import { LetModule } from '@ngrx/component'
import { GridStoreService, UiFacade } from '@project-id/data-access/facades'
import { map, Observable, switchMap } from 'rxjs'
import { MatButtonModule } from '@angular/material/button'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'

import { LogoNameV3Component } from '@shared/ui/logo'
import { MatMenuModule } from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon'
import { GridFacade, SelectedFacade, StringsFacade } from '@project-id/data-access/facades'
import { GridMode } from '@shared/data-access/models'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    LogoNameV3Component,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    LetModule,
  ],
  templateUrl: './toolbar.component.html',
  styles: [],
})
export class ToolbarComponent {
  private gridFacade = inject(GridFacade)
  private gridStore = inject(GridStoreService)
  private selectedFacade = inject(SelectedFacade)
  private stringsFacade = inject(StringsFacade)
  private uiFacade = inject(UiFacade)
  private store = inject(Store)
  gridMode$: Observable<GridMode> = this.gridFacade.gridMode$
  keymap$ = this.uiFacade.isKeyMapEnabled$
  selectedStringName$ = this.selectedFacade.selectedStringId$.pipe(
    switchMap(stringId => this.stringsFacade.stringById$(stringId).pipe(
      map(string => {
        if (!string) return undefined
        return string.name
      }),
    )),
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
    this.uiFacade.toggleKeyMap()
  }
}
