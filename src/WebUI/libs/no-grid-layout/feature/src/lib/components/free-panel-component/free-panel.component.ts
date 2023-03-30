import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdkDrag, CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop'
import { FreePanelModel } from '../../free-panel.model'
import { FreePanelDirective } from './free-panel.directive'
import { NoGridLayoutService } from '../../no-grid-layout.service'
import { Observable, tap } from 'rxjs'

@Component({
  selector: 'app-free-panel',
  templateUrl: './free-panel.component.html',
  styles: [],
  imports: [
    CommonModule,
    CdkDrag,
    FreePanelDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FreePanelComponent implements OnInit, AfterViewInit {
  private freePanelRef = inject(ElementRef<FreePanelComponent>)
  private noGridLayoutService = inject(NoGridLayoutService)
  // freePanel$ = of({} as FreePanelModel)
  freePanel$!: Observable<FreePanelModel | undefined>
  pageX = 0
  pageY = 0
  private _classes = ''

  get classes() {
    return this._classes
  }

  set classes(value: string) {
    console.log('classes', value)
    this._classes = value
  }

  // classes = ''

  /*  private _freePanel!: FreePanelModel
   @Input() set freePanel(value: FreePanelModel) {
   console.log('freePanel', value)
   this.dragPosition = { x: value.x, y: value.y }
   }

   get freePanel() {
   return this._freePanel
   }*/

  // @Input() freePanel!: FreePanelModel
  @Input() set panelId(value: string) {
    console.log('panelId', value)
    this.freePanel$ = this.noGridLayoutService.getPanelById(value).pipe(
      tap((freePanel) => {
          console.log('freePanel', freePanel)
          // this.dragPosition = freePanel?.location
          // this.classes = freePanel?.border
        },
      ),
    )
    console.log('freePanel', this.freePanel$)
  }

  @Input() set location(value: { x: number; y: number }) {
    this.dragPosition = value
  }

  savedPosition: { x: number, y: number } = { x: 0, y: 0 }
  rotation = 0
  private _dragPosition: any
  set dragPosition(value: any) {
    // console.log('dragPosition', value)
    this._dragPosition = value
  }

  get dragPosition() {
    return this._dragPosition
  }

  ngOnInit() {
    // console.log('freePanel', this.freePanel)
    // this.dragPosition = this.freePanel.location
    // this.dragPosition = { x: this.freePanel.x, y: this.freePanel.y }
    // console.log('freePanel', this.freePanel)
    console.log('dragPosition', this.dragPosition)
    const parentEl = this.freePanelRef.nativeElement.parentElement
    console.log('parentEl', parentEl)

  }

  click(event: MouseEvent) {
    /*  const rect = this.freePanelRef.nativeElement.getBoundingClientRect()

     this.startX = xy.x - rect.left
     this.startY = xy.y - rect.top*/
    this.pageX = event.pageX
    this.pageY = event.pageY
    const rect = this.freePanelRef.nativeElement.getBoundingClientRect()

    const mouseX = this.pageX - rect.left
    const mouseY = this.pageY - rect.top
  }

  dragDropped(event: CdkDragDrop<FreePanelModel>) {
    // event.preventDefault()
    console.log('dragDropped', event)

  }

  dragMoved(event: CdkDragMove<FreePanelModel>) {
    // event.preventDefault()
    // console.log('dragMoved', event)
    // this.savedPosition = { x: event.source.getFreeDragPosition().x, y: event.source.getFreeDragPosition().y }
    // console.log('savedPosition', this.savedPosition)
  }

  ngAfterViewInit(): void {
    /*    const rect = this.freePanelRef.nativeElement.getBoundingClientRect()
     console.log('rect', rect)
     // this.dragPosition = { x: this.freePanel.x, y: this.freePanel.y }
     const mouseX = this.pageX - rect.left
     const mouseY = this.pageY - rect.top
     this.dragPosition = { x: this.freePanel.x + mouseX, y: this.freePanel.y + mouseY }*/

  }
}
