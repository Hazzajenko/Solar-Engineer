import { DragDropModule } from '@angular/cdk/drag-drop'
import { AsyncPipe, NgIf, NgStyle } from '@angular/common'
import { Component, inject, Input, ViewChild } from '@angular/core'

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { MatTooltipModule } from '@angular/material/tooltip'
import { LetDirective } from '@ngrx/component'
import { LinksService } from '@grid-layout/data-access'

import { Store } from '@ngrx/store'
import { DisconnectionPointModel } from '@shared/data-access/models'
// import { AppState } from '@shared/data-access/store'

import { PanelLinkComponent } from '../shared-ui/panel-link/panel-link.component'

@Component({
  selector: 'app-block-disconnection-point',
  templateUrl: './block-disconnection-point.component.html',
  styleUrls: ['./block-disconnection-point.component.scss'],
  imports: [
    DragDropModule,
    MatTooltipModule,
    NgStyle,
    NgIf,
    AsyncPipe,
    LetDirective,
    MatMenuModule,
    PanelLinkComponent,
  ],
  standalone: true,
})
export class BlockDisconnectionPointComponent {
  @Input() id!: string

  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  // private store = inject(Store<AppState>)
  // private disconnectionPointsEntity = inject(DisconnectionPointsEntityService)
  private linksService = inject(LinksService)

  displayTooltip(disconnectionPoint: DisconnectionPointModel): string {
    return `
       Location = ${disconnectionPoint.location} \r\n
       String: ${disconnectionPoint.stringId} \r\n
    `
  }

  onRightClick(event: MouseEvent, dp: DisconnectionPointModel) {
    event.preventDefault()
    // this.rightClickDp.emit({ event, item: dp })

    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { dp }
    this.matMenuTrigger.openMenu()
  }

  /*   ngOnInit() {
/*     this.gridMode$ = this.store.select(selectGridMode)
    this.disconnectionPoint$ = this.disconnectionPointsEntity.entities$.pipe(
      map((dps) => dps.find((dp) => dp.id === this.id)),
    )
    this.dpToJoin$ = this.store.select(selectDpToLink)
    this.selectedId$ = this.store.select(selectSelectedId).pipe(distinctUntilChanged())
    this.selectedPositiveTo$ = this.store.select(selectSelectedPositiveTo)
    this.selectedNegativeTo$ = this.store.select(selectSelectedNegativeTo)
    this.selectedUnit$ = this.store.select(selectUnitSelected)
    this.joinState$ = this.store.select(selectLinksState)
  } */

  dpAction(disconnectionPoint: DisconnectionPointModel) {
    if (!disconnectionPoint) {
      return console.error('err dpAction !disconnectionPoint')
    }

    /*   firstValueFrom(this.store.select(selectGridMode))
      .then((gridMode) => {
        switch (gridMode) {
          case GridMode.LINK:
            /*            firstValueFrom(this.store.select(selectLinksState)).then((joinsState) => {
              this.linksService.addDpToLink(disconnectionPoint, joinsState)
            })
            break

          case GridMode.DELETE:
            this.disconnectionPointsEntity.delete(disconnectionPoint)
            break
          case GridMode.SELECT:
            this.store.dispatch(SelectedStateActions.selectDp({ dpId: disconnectionPoint.id }))
            break
          default:
            this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
            this.store.dispatch(SelectedStateActions.selectDp({ dpId: disconnectionPoint.id }))
            break
        }
      })
      .catch((err) => {
        return console.error('err dpAction this.store.select(selectGridMode)' + err)
      }) */
  }

  deleteDisconnectionPoint(disconnectionPoint: DisconnectionPointModel) {
    // this.disconnectionPointsEntity.delete(disconnectionPoint)
  }
}
