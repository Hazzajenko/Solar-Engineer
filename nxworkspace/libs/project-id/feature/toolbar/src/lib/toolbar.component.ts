import { Observable } from 'rxjs'
import { MatButtonModule } from '@angular/material/button'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { GridLayoutComponent } from '@project-id/feature/grid-layout'
import { LogoNameV3Component } from '@shared/ui/logo'
import { MatMenuModule } from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon'
import { GridActions, GridFacade } from '@project-id/data-access/store'
import { GridMode } from '@shared/data-access/models'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    GridLayoutComponent,
    LogoNameV3Component,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './toolbar.component.html',
  styles: [],
})
export class ToolbarComponent {
  private gridFacade = inject(GridFacade)
  private store = inject(Store)
  gridMode$: Observable<GridMode> = this.gridFacade.gridMode$
  selectMode(gridMode: GridMode) {
    switch (gridMode) {
      case GridMode.CREATE:
        return this.gridFacade.selectCreateMode()
      case GridMode.SELECT:
        return this.gridFacade.selectSelectMode()

      case GridMode.LINK:
        return this.gridFacade.selectLinkMode()

      case GridMode.DELETE:
        return this.gridFacade.selectDeleteMode()
      default:
        return
    }
  }
}
