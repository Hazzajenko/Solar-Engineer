import { ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdkDrag, CdkDragDrop, CdkDragEnd, CdkDragMove, Point } from '@angular/cdk/drag-drop'
import { DesignPanelDirective } from './design-panel.directive'
import { Observable, tap } from 'rxjs'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { ShowSvgComponent } from '@shared/ui'
import { DesignPanelStore } from './design-panel.store'
import { DesignPanelFactory, DesignPanelModel, PanelRotation, SelectedPanelState } from '../types'
import { DesignPanelMenuComponent } from './design-panel-menu'
import { LetModule } from '@ngrx/component'
import { DesignPanelVm } from './design-panel.vm'
import { ComponentElementsService, MousePositioningService } from 'design-app/utils'

@Component({
  selector:        'app-design-panel',
  templateUrl:     './design-panel.component.html',
  styles:          [],
  imports:         [
    CommonModule,
    CdkDrag,
    DesignPanelDirective,
    MatMenuModule,
    ShowSvgComponent,
    DesignPanelMenuComponent,
    LetModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:       [
    DesignPanelStore,
  ],
  standalone:      true,
})
export class DesignPanelComponent
  implements OnInit {
  private _mousePositioningService = inject(MousePositioningService)
  private _componentElementsService = inject(ComponentElementsService)
  private _designPanelsStore = inject(DesignPanelStore)
  private _panelId!: string
  public store = this._designPanelsStore
  location!: Point
  menuTopLeftPosition = {
    x: '0',
    y: '0',
  }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  panel$!: Observable<DesignPanelModel>
  /*  public vm$ = this._designPanelsStore.vm$.pipe(
   tap((vm) => console.log('vm', vm)),
   )*/
  public vm$!: Observable<DesignPanelVm>
  protected readonly PanelRotationConfig = PanelRotation
  protected readonly SelectedPanelState = SelectedPanelState

  get panelId() {
    return this._panelId
  }

  @Input() set panelId(panelId: string) {
    this._panelId = panelId
    // this.
    console.log('set panelId', panelId)
    this.vm$ = this._designPanelsStore.vm$(panelId)
      .pipe(
        tap((vm) => {
            console.log('vm', vm)
            this.location = vm.panel.location
          },
        ),
      )
    /*    this.panel$ = this._designPanelsStore.panel$.pipe(
     tap((freePanel) => {
     console.log('freePanel', freePanel)
     this.location = freePanel.location
     },
     ),
     )*/
  }

  ngOnInit() {
    console.log('ngOnInit', this._panelId)
  }

  dragDropped(event: CdkDragDrop<DesignPanelModel>) {
    console.log('dragDropped', event)
  }

  dragMoved(event: CdkDragMove<DesignPanelModel>) {
    const size = DesignPanelFactory.size(event.source.data.rotation)
    this.location = this._mousePositioningService.getMousePositionFromPageXYWithSize(event.event as MouseEvent, size)
  }

  /*  startDragging(event: CdkDragStart) {
   }*/

  dragExited(event: CdkDragEnd) {
    console.log('dragExited', event)
    this._designPanelsStore.updatePanel({ location: this.location })
  }

  onRightClick(event: MouseEvent, panel: DesignPanelModel) {
    event.preventDefault()
    const blockRect = this._componentElementsService.getElementRectById(panel.id)
    if (!blockRect) {
      return
    }

    this.menuTopLeftPosition.x = blockRect.x + 'px'
    this.menuTopLeftPosition.y = blockRect.y + 'px'
    this.matMenuTrigger.menuData = { freePanel: panel }
    this.matMenuTrigger.openMenu()
  }

}
