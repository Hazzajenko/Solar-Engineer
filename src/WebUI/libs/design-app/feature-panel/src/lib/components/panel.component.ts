import { ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdkDrag, CdkDragDrop, CdkDragEnd, CdkDragMove, Point } from '@angular/cdk/drag-drop'
import { PanelComponentDirective } from './panel-component.directive'
import { Observable, tap } from 'rxjs'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { ShowSvgComponent } from '@shared/ui'
import { PanelComponentStore } from './panel-component.store'
import { PanelFactory, PanelModel, PanelRotation, SelectedPanelState } from '../types'
import { PanelMenuComponent } from './panel-menu'
import { LetModule } from '@ngrx/component'
import { PanelComponentVm } from './panel-component.vm'
import { ComponentElementsService, MousePositioningService } from 'design-app/utils'

@Component({
  selector:        'app-panel',
  templateUrl:     './panel.component.html',
  styles:          [],
  imports:         [
    CommonModule,
    CdkDrag,
    PanelComponentDirective,
    MatMenuModule,
    ShowSvgComponent,
    PanelMenuComponent,
    LetModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:       [
    PanelComponentStore,
  ],
  standalone:      true,
})
export class PanelComponent
  implements OnInit {
  private _mousePositioningService = inject(MousePositioningService)
  private _componentElementsService = inject(ComponentElementsService)
  private _designPanelsStore = inject(PanelComponentStore)
  private _panelId!: string
  public store = this._designPanelsStore
  location!: Point
  menuTopLeftPosition = {
    x: '0',
    y: '0',
  }
  @ViewChild('contextMenu', { static: true })
  contextMenu!: ElementRef<HTMLDivElement>
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  panel$!: Observable<PanelModel>
  /*  public vm$ = this._designPanelsStore.vm$.pipe(
   tap((vm) => console.log('vm', vm)),
   )*/
  public vm$!: Observable<PanelComponentVm>
  menuOpen = false
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

  dragDropped(event: CdkDragDrop<PanelModel>) {
    console.log('dragDropped', event)
  }

  dragMoved(event: CdkDragMove<PanelModel>) {
    const size = PanelFactory.size(event.source.data.rotation)
    this.location = this._mousePositioningService.getMousePositionFromPageXYWithSize(event.event as MouseEvent, size)
  }

  /*  startDragging(event: CdkDragStart) {
   }*/

  dragExited(event: CdkDragEnd) {
    console.log('dragExited', event)
    this._designPanelsStore.updatePanel({ location: this.location })
  }

  handleRightClick(event: MouseEvent, panel: PanelModel) {
    event.preventDefault()
    const blockRect = this._componentElementsService.getElementRectById(panel.id)
    if (!blockRect) {
      return
    }
    console.log('blockRect', blockRect)
    console.log('contextMenu', this.contextMenu.nativeElement)

    this.menuTopLeftPosition.x = blockRect.x + 'px'
    this.menuTopLeftPosition.y = blockRect.y + 'px'
    this.contextMenu.nativeElement.style.left = this.menuTopLeftPosition.x
    this.contextMenu.nativeElement.style.top = this.menuTopLeftPosition.y
    this.contextMenu.nativeElement.style.display = 'block'
    this.menuOpen = true

    // console.log('handleRightClick', event, panel)

    // this.onRightClick(event, panel)
  }

  onRightClick(event: MouseEvent, panel: PanelModel) {
    event.preventDefault()
    const blockRect = this._componentElementsService.getElementRectById(panel.id)
    if (!blockRect) {
      return
    }
    console.log('blockRect', blockRect)

    this.menuTopLeftPosition.x = blockRect.x + 'px'
    this.menuTopLeftPosition.y = blockRect.y + 'px'
    // this.matMenuTrigger.
    this.matMenuTrigger.menuData = { freePanel: panel }
    this.matMenuTrigger.openMenu()
  }

  // protected readonly vm = vm

}
