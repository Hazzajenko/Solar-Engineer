import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Output,
} from '@angular/core'
import { ElementOffsets } from '@grid-layout/shared/models'

@Directive({
  selector: '[appGrid]',
  standalone: true,
})
export class GridDirective implements AfterViewInit {
  private elementRef = inject(ElementRef<HTMLDivElement>)

  @Output() elementOffsets: EventEmitter<ElementOffsets> = new EventEmitter<ElementOffsets>()

  ngAfterViewInit() {
    const offsets: ElementOffsets = {
      offsetHeight: this.elementRef.nativeElement.offsetHeight,
      offsetWidth: this.elementRef.nativeElement.offsetWidth,
      offsetLeft: this.elementRef.nativeElement.offsetLeft,
      offsetTop: this.elementRef.nativeElement.offsetTop,
    }
    this.elementOffsets.emit(offsets)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    console.log(event)
    const offsets: ElementOffsets = {
      offsetHeight: this.elementRef.nativeElement.offsetHeight,
      offsetWidth: this.elementRef.nativeElement.offsetWidth,
      offsetLeft: this.elementRef.nativeElement.offsetLeft,
      offsetTop: this.elementRef.nativeElement.offsetTop,
    }
    this.elementOffsets.emit(offsets)
    // this.canvas.nativeElement.width = window.innerWidth
    // this.canvas.nativeElement.height = window.innerHeight
    // event.target.innerWidth;
  }
}
