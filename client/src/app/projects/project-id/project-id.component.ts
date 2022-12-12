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
import { ProjectsService } from '../services/projects.service'
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
import { ActivatedRoute, Router } from '@angular/router'
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

  constructor(
    private store: Store<AppState>,
    private projects: ProjectsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  /*
  resetPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParamsHandling: "merge"
    })
  }
*/

  /*  @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
      event.preventDefault()
      event.stopPropagation()

      if (event.altKey) {
        // this.onMultiDrag(event)
        const mouseX = event.clientX - this.offsetX
        const mouseY = event.clientY - this.offsetY

        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

        const width = mouseX - this.startX!
        const height = mouseY - this.startY!

        this.ctx.globalAlpha = 0.4

        this.ctx.fillStyle = '#7585d8'
        this.ctx.fillRect(this.startX!, this.startY!, width, height)

        this.ctx.globalAlpha = 1.0
      } else {
        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
      }
      /!*    if (isLinking) {
        this.onLinking(event)
      } else {
        this.ctx.closePath()
        // this.resetPage()
        // this.ngOnInit()
      }*!/
    }*/

  /*  onMouseMove(event: MouseEvent) {
      event.preventDefault()
      event.stopPropagation()
      if (event.altKey) {
        const mouseX = event.clientX - this.offsetX
        const mouseY = event.clientY - this.offsetY

        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

        const width = mouseX - this.startX!
        const height = mouseY - this.startY!

        this.ctx.globalAlpha = 0.4

        this.ctx.fillStyle = '#7585d8'
        this.ctx.fillRect(this.startX!, this.startY!, width, height)

        this.ctx.globalAlpha = 1.0
      } else {
        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
      }
    }*/

  @HostListener('document:mousemove', ['$event'])
  onMultiDrag2(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    // console.log(this.isDraggingBool)
    // console.log(this.startX)
    // console.log(this.startY)
    // console.log(event.altKey)
    if (this.startX && this.startY && event.altKey && this.isDraggingBool) {
      console.log(
        '\n' + '    if (this.isDraggingBool && this.startX && this.startY && event.altKey) {',
      )
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
      // this.startX = undefined
      // this.startY = undefined
    }
  }

  /*
    onLinking(event: MouseEvent) {
      event.preventDefault()
      event.stopPropagation()

      const mouseX = event.clientX - this.offsetX
      const mouseY = event.clientY - this.offsetY

      this.ctx.closePath()

      this.ctx.strokeStyle = '#e1180c'
      this.ctx.lineWidth = 5
      this.ctx.beginPath()
      this.ctx.moveTo(this.startX, this.startY)
      this.ctx.lineTo(mouseX, mouseY)
      this.ctx.stroke()

      /!*      this.ctx.globalAlpha = 0.4

        this.ctx.fillStyle = '#7585d8'
        this.ctx.fillRect(this.startX, this.startY, width, height)

        this.ctx.globalAlpha = 1.0*!/
    }*/

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
    /*
        firstValueFrom(this.store.select(selectBlocksByProjectIdRouteParams).pipe(
          map(blocks => blocks.find(b => b.id === '1f1cdc069343b93b5ec0db0ef44d'))
        )).then(res => {
          this.ctx.beginPath()
          this.ctx.moveTo(this.startX, this.startY)
          this.ctx.lineTo(res!.x!, res!.y!)
          this.ctx.stroke()
        })*/
  }

  /*  canvasAction(event: MouseEvent) {
      if (event.altKey) {
        firstValueFrom(this.store.select(selectMultiState)).then((multiState) => {
          const rect = this.canvas.nativeElement.getBoundingClientRect()
          if (multiState) {
            if (!multiState.locationStart) {
              this.startX = event.clientX - rect.left
              this.startY = event.clientY - rect.top
            } else {
              let height: number
              this.endX = event.clientX - rect.left
              this.endY = event.clientY - rect.top

              height = this.startY - this.endY
              if (height > 0) {
                height = height * -1
              } else {
                height = Math.abs(height)
              }
            }
          }
        })
      }
    }*/

  /*  drawPaths(pathMapCoords: Map<string, { x: number; y: number }>) {
      pathMapCoords.forEach((cord) => {
        this.ctx.strokeStyle = '#e1180c'
        this.ctx.lineWidth = 5
        this.ctx.beginPath()
        this.ctx.moveTo(this.startX, this.startY)
        // const mouseX = event.clientX - this.offsetX
        // const mouseY = event.clientY - this.offsetY
        // this.startX = event.clientX - rect.left
        // this.startY = event.clientY - rect.top
        this.ctx.lineTo(cord.x - this.offsetX, cord.y - this.offsetY)
        this.ctx.stroke()
      })
      // this.items.forEach((it) => console.log(it.panelDiv))
    }*/

  onMouseDown(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    console.log('onMouseDown', event)
    const rect = this.canvas.nativeElement.getBoundingClientRect()

    if (event.altKey) {
      console.log('    if (event.altKey && isDragging) {')
      this.startX = event.clientX - rect.left
      this.startY = event.clientY - rect.top
      let height: number
      this.endX = event.clientX - rect.left
      this.endY = event.clientY - rect.top
      height = this.startY - this.endY
      if (height > 0) {
        height = height * -1
      } else {
        height = Math.abs(height)
      }
      /*      const multiState = await firstValueFrom(this.store.select(selectMultiState))
            const rect = this.canvas.nativeElement.getBoundingClientRect()
            if (multiState) {
              if (!multiState.locationStart) {
                this.startX = event.clientX - rect.left
                this.startY = event.clientY - rect.top
              } else {
                let height: number
                this.endX = event.clientX - rect.left
                this.endY = event.clientY - rect.top
              }
            }*/
      this.isDraggingBool = true
      /*      firstValueFrom(this.store.select(selectMultiState)).then((multiState) => {
              const rect = this.canvas.nativeElement.getBoundingClientRect()
              if (multiState) {
                if (!multiState.locationStart) {
                  this.startX = event.clientX - rect.left
                  this.startY = event.clientY - rect.top
                } else {
                  let height: number
                  this.endX = event.clientX - rect.left
                  this.endY = event.clientY - rect.top
                }
              }
              this.isDraggingBool = true
              /!*        console.log('    if (event.altKey && isDragging) {')
                      const mouseX = event.clientX - this.offsetX
                      const mouseY = event.clientY - this.offsetY

                      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

                      const width = mouseX - this.startX!
                      const height = mouseY - this.startY!

                      this.ctx.globalAlpha = 0.4

                      this.ctx.fillStyle = '#7585d8'
                      this.ctx.fillRect(this.startX!, this.startY!, width, height)

                      this.ctx.globalAlpha = 1.0*!/
            })*/
    } else {
      this.isDraggingBool = false
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
      // this.startX = undefined
      // this.startY = undefined
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
