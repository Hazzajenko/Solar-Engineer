import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ImageStore } from './data-access/image.store'
import { ImageDirective } from './directives/image.directive'
import { Observable } from 'rxjs'
import { LetModule } from '@ngrx/component'
import { CanvasDirective } from './directives/canvas.directive'
import { CanvasComponent } from './ui/canvas.component'

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule, ImageDirective, LetModule, CanvasDirective, CanvasComponent],
  providers: [ImageStore],
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>
  top!: number
  bottom!: number
  left!: number
  right!: number
  centerX!: number
  centerY!: number
  zoomLevel: number = 0
  maxZoom: number = 5
  canvasWidth!: number
  canvasHeight!: number
  private store = inject(ImageStore)
  image$: Observable<HTMLImageElement> = this.store.image$
  private ctx!: CanvasRenderingContext2D

  ngAfterViewInit() {
    // this.canvas.nativeElement = initCanvas(this.canvas.nativeElement)
    // this.ctx = this.canvas.nativeElement.getContext('2d')!
  }

  /* async ngAfterViewInit() {
     let canvas = this.canvas.nativeElement
     canvas.style.width = '100%'
     canvas.style.height = '100%'
     canvas.width = this.canvas.nativeElement.offsetWidth
     canvas.height = this.canvas.nativeElement.offsetHeight
     // this.offsetX = this.canvas.nativeElement.offsetLeft
     // this.offsetY = this.canvas.nativeElement.offsetTop

     this.ctx = this.canvas.nativeElement.getContext('2d')!

     let image = new Image()

     image.onload = () => {
       let w = canvas.width
       let nw = image.naturalWidth
       let nh = image.naturalHeight
       let aspect = nw / nh
       let h = w / aspect
       this.ctx.drawImage(image, 0, 0, w, h)
       // this.ctx.drawImage(image, 0, 650, 400, 200/aspect, 0, 0, w, h)
     }
     /!*    this.backgroundBlob = await lastValueFrom(
       this.http.get('/api/files/background', { responseType: 'blob' }),
     )

     this.createImage(this.backgroundBlob ).then((src) => {
       image.src = `${src}`
     })*!/
   }*/

  mouseDown(event: MouseEvent) {}

  mouseUp(event: MouseEvent) {}
}
