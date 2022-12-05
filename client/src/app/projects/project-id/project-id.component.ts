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
import { firstValueFrom, Observable } from 'rxjs'
import { selectMultiState } from './services/store/multi-create/multi.selectors'
import { map } from 'rxjs/operators'
import { LetModule } from '@ngrx/component'

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
  ],
})
export class ProjectIdComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>
  startX: number = 0
  startY: number = 0
  endX: number = 0
  endY: number = 0
  // canvasOffset = this.canvas.nativeElement.offsetTop
  offsetX: number = 0
  offsetY: number = 0
  scrollX: number = 0
  scrollY: number = 0
  isDragging$!: Observable<boolean>

  private ctx!: CanvasRenderingContext2D

  constructor(private store: Store<AppState>, private projects: ProjectsService) {}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent, isDragging: boolean | null) {
    event.preventDefault()
    event.stopPropagation()

    if (isDragging) {
      // if we're not dragging, just return
      // if(!isDown){return;}

      // get the current mouse position
      // mouseX=parseInt(event.clientX-this.offsetX);
      // mouseY=parseInt(event.clientY-offsetY);
      const mouseX = event.clientX - this.offsetX
      const mouseY = event.clientY - this.offsetY

      // Put your mousemove stuff here

      // clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

      // calculate the rectangle width/height based
      // on starting vs current mouse position
      const width = mouseX - this.startX
      const height = mouseY - this.startY

      // draw a new rect from the start position
      // to the current mouse position
      this.ctx.globalAlpha = 0.4
      // this.ctx.fillRect(50, 50, 75, 50)
      /*     let thickness = 100
           this.ctx.fillStyle = '#000'
           this.ctx.fillRect(
             this.startX - thickness,
             this.startY - thickness,
             width + thickness * 2,
             height + thickness * 2,
           )*/

      this.ctx.fillStyle = '#7585d8'
      this.ctx.fillRect(this.startX, this.startY, width, height)
      /*
            this.ctx.strokeStyle = '#0e0303'
            this.ctx.strokeRect(this.startX, this.startY, width, height)*/
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
  }

  ngAfterViewInit(): void {
    this.canvas.nativeElement.style.width = '100%'
    this.canvas.nativeElement.style.height = '100%'
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight
    /*    const canvasOffset = this.canvas.nativeElement.offsetTop*/
    this.offsetX = this.canvas.nativeElement.offsetLeft
    this.offsetY = this.canvas.nativeElement.offsetTop
    this.scrollX = this.canvas.nativeElement.scrollLeft
    this.scrollY = this.canvas.nativeElement.scrollTop

    this.ctx = this.canvas.nativeElement.getContext('2d')!
    // this.ctx.fillStyle = 'red'
    // this.ctx.fillRect(0, 0, 5, 5)
    // this.ctx.fillStyle = 'red'
    // this.ctx.beginPath()
    /*    this.ctx.beginPath()
        this.ctx.rect(20, 20, 150, 100)
        this.ctx.stroke()*/
  }

  canvasAction(event: MouseEvent) {
    firstValueFrom(this.store.select(selectMultiState)).then((multiState) => {
      const rect = this.canvas.nativeElement.getBoundingClientRect()
      if (multiState) {
        if (!multiState.locationStart) {
          /*          console.log('if (!multiState.locationStart)')
                    const canvasOffset = this.canvas.nativeElement.offsetTop
                    const offsetX = this.canvas.nativeElement.offsetLeft
                    const offsetY = this.canvas.nativeElement.offsetTop
                    const scrollX = this.canvas.nativeElement.scrollLeft
                    const scrollY = this.canvas.nativeElement.scrollTop*/
          /*
                    this.startX = event.clientX - rect.left
                    this.startY = event.clientY - rect.top*/
          this.startX = event.clientX - rect.left
          this.startY = event.clientY - rect.top
          /*     this.ctx.beginPath()
               this.ctx.rect(event.clientX - rect.left, event.clientY - rect.top, 150, 100)
               this.ctx.stroke()*/
        } else {
          /*          const height = this.startY - event.clientY
                    const width = this.startX - event.clientX*/
          let height: number
          this.endX = event.clientX - rect.left
          this.endY = event.clientY - rect.top
          /*          if (this.startY < event.clientY) {
                      console.log(`${this.startY}  -  ${event.clientY}`)
                      height = this.startY - event.clientY
                    } else {
                      console.log(`${this.startY}  -  ${event.clientY}`)
                      height = this.startY - event.clientY
                      // height = event.clientY + this.startY
                    }*/
          height = this.startY - this.endY
          if (height > 0) {
            height = height * -1
            // height = height - height * 2
          } else {
            height = Math.abs(height)
            // height = height + height * 2
          }
          /*
                    // const height = (event.clientY - this.startY) / 2
                    const width = event.clientX - this.startX
                    console.log(event.clientX, event.clientY, width, height)
                    console.log('HEIGHT', height)
                    this.ctx.rect(this.startX, this.startY, width, height)
                    this.ctx.stroke()*/
        }
      }
    })
    console.log(event)
  }
}
