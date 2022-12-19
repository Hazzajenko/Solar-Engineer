import {
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core'
import { Subscription } from 'rxjs'
import { initCanvas } from '../canvas'

@Directive({
  selector: '[imageDirective]',
  standalone: true,
})
export class ImageDirective implements OnDestroy {
  @Output() clickOutside = new EventEmitter<boolean>()
  @Input() image?: HTMLImageElement
  cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  cameraZoom = 1
  MAX_ZOOM = 5
  MIN_ZOOM = 0.1
  SCROLL_SENSITIVITY = 0.0005
  #subscription = new Subscription()
  private canvas = inject(ElementRef<HTMLCanvasElement>)
  private ctx!: CanvasRenderingContext2D

  constructor(private el: ElementRef) {}

  @Input() set canvasImage(image: HTMLImageElement) {
    if (!image) {
      return
    }
    let canvas = initCanvas(this.canvas.nativeElement)
    // let canvas = this.canvas.nativeElement
    // canvas.style.width = '100%'
    // canvas.style.height = '100%'
    // canvas.width = this.canvas.nativeElement.offsetWidth
    // canvas.height = this.canvas.nativeElement.offsetHeight
    // this.offsetX = this.canvas.nativeElement.offsetLeft
    // this.offsetY = this.canvas.nativeElement.offsetTop

    this.ctx = this.canvas.nativeElement.getContext('2d')!
    console.log('yes')

    /*    let w = canvas.width
        let nw = image.naturalWidth
        let nh = image.naturalHeight
        let aspect = nw / nh
        let h = w / aspect
        this.ctx.drawImage(image, 0, 0, w, h)*/
    image.onload = () => {
      let w = canvas.width
      let nw = image.naturalWidth
      let nh = image.naturalHeight
      let aspect = nw / nh
      let h = w / aspect
      let dx = (canvas.width - image.naturalWidth) / 2
      this.ctx.drawImage(image, dx, 0, nw, nh)
      // this.ctx.drawImage(image, 0, 0, nw, nh)
      // this.ctx.drawImage(image, 0, 650, 400, 200/aspect, 0, 0, w, h)
    }
  }

  /*@Input() set jbhClickOutside(enableClickOutside: boolean) {
    if (!enableClickOutside) {
      return
    }

    this.#subscription.add(
      fromEvent(document, 'click')
        .pipe(
          map((event) => event.target),
          filter((target) => !this.el.nativeElement.contains(target)),
        )
        .subscribe(() => this.clickOutside.emit(true)),
    )
  }*/

  /*  @HostListener('mouseenter') onMouseEnter() {
      console.log('mouseenter')
    }*/

  ngOnDestroy(): void {
    this.#subscription.unsubscribe()
  }
}
