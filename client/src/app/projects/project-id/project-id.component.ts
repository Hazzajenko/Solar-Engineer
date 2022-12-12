import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { GridLayoutComponent } from './grid-layout/grid-layout.component'
import { AsyncPipe, CommonModule, NgIf } from '@angular/common'
import { GridToolbarComponent } from './grid-layout/grid-toolbar/grid-toolbar.component'
import { MatSliderModule } from '@angular/material/slider'
import { FormsModule } from '@angular/forms'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatButtonModule } from '@angular/material/button'
import { Observable } from 'rxjs'
import { selectMultiState } from './services/store/multi-create/multi.selectors'
import { map } from 'rxjs/operators'
import { LetModule } from '@ngrx/component'
import { selectLinksState } from './services/store/links/links.selectors'
import { TypeModel } from '../models/type.model'
import { GridOverlayComponent } from './grid-layout/grid-overlay/grid-overlay.component'
import { selectSelectedStringPathMapCoords } from './services/store/selected/selected.selectors'

@Component({
  selector: 'app-project-id',
  templateUrl: './project-id.component.html',
  styleUrls: ['./project-id.component.scss'],
  standalone: true,
  imports: [
    GridLayoutComponent,
    NgIf,
    AsyncPipe,
    GridToolbarComponent,
    CommonModule,
    MatSliderModule,
    FormsModule,
    DragDropModule,
    MatButtonModule,
    LetModule,
    GridOverlayComponent,
  ],
})
export class ProjectIdComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>
  pathMapCoords$!: Observable<Map<string, { x: number; y: number }> | undefined>
  // startX?: number = undefined
  // startY?: number = undefined
  startX: number = 0
  startY: number = 0
  endX: number = 0
  endY: number = 0
  // canvasOffset = this.canvas.nativeElement.offsetTop
  offsetX: number = 0
  offsetY: number = 0
  scrollX: number = 0
  scrollY: number = 0
  isDraggingBool: boolean = false
  isDragging$!: Observable<boolean>
  isLinking$!: Observable<boolean>
  private ctx!: CanvasRenderingContext2D

  constructor(private store: Store<AppState>) {}

  @HostListener('document:mousemove', ['$event'])
  onMultiDrag2(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (this.startX && this.startY && event.altKey && this.isDraggingBool) {
      const mouseX = event.clientX - this.offsetX
      const mouseY = event.clientY - this.offsetY

      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

      const width = mouseX - this.startX
      const height = mouseY - this.startY

      this.ctx.globalAlpha = 0.4

      this.ctx.fillStyle = '#7585d8'
      this.ctx.fillRect(this.startX, this.startY, width, height)

      this.ctx.globalAlpha = 1.0
    } else {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    }
  }

  ngOnInit(): void {
    this.isDragging$ = this.store.select(selectMultiState).pipe(
      map((multiState) => {
        return !!(multiState.multiMode && multiState.locationStart)
      }),
    )
    this.isLinking$ = this.store.select(selectLinksState).pipe(
      map((linksState) => {
        return !!(linksState.typeToLink === TypeModel.PANEL && linksState.panelToLink)
      }),
    )

    this.pathMapCoords$ = this.store.select(selectSelectedStringPathMapCoords)
  }

  ngAfterViewInit(): void {
    this.canvas.nativeElement.style.width = '100%'
    this.canvas.nativeElement.style.height = '100%'
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight
    this.offsetX = this.canvas.nativeElement.offsetLeft
    this.offsetY = this.canvas.nativeElement.offsetTop
    this.scrollX = this.canvas.nativeElement.scrollLeft
    this.scrollY = this.canvas.nativeElement.scrollTop

    this.ctx = this.canvas.nativeElement.getContext('2d')!
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    console.log('onMouseDown', event)
    const rect = this.canvas.nativeElement.getBoundingClientRect()

    if (event.altKey) {
      this.startX = event.clientX - rect.left
      this.startY = event.clientY - rect.top
      this.endX = event.clientX - rect.left
      this.endY = event.clientY - rect.top

      this.isDraggingBool = true
    } else {
      this.isDraggingBool = false
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    }
  }

  onMouseUp(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    console.log('onMouseUp', event)
    this.isDraggingBool = false
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
  }

  altKeyup(event: KeyboardEvent) {
    event.preventDefault()
    event.stopPropagation()
    console.log('ALT-KEYUP', event)
    this.isDraggingBool = false
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
  }

  stopDragging(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDraggingBool = false
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
  }
}
