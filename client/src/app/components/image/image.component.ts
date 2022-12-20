import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ImageStore } from './data-access/image.store'
import { ImageDirective } from './directives/image.directive'
import { Observable } from 'rxjs'
import { LetModule } from '@ngrx/component'
import { CanvasDirective } from './directives/canvas.directive'
import { CanvasComponent } from './ui/canvas.component'
import { Canvas2Component } from './ui/canvas2.component'
import { ImageFile } from '../../shared/models/images/image-list-response'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [
    CommonModule,
    ImageDirective,
    LetModule,
    CanvasDirective,
    CanvasComponent,
    Canvas2Component,
    MatButtonModule,
  ],
  providers: [ImageStore],
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>
  image$!: Observable<HTMLImageElement>
  private store = inject(ImageStore)
  // image$: Observable<HTMLImageElement> = this.store.image$
  imageList$: Observable<ImageFile[]> = this.store.imageList$
  private ctx!: CanvasRenderingContext2D

  ngAfterViewInit() {
    this.store.imageList$.subscribe((res) => console.log(res))
    // this.canvas.nativeElement = initCanvas(this.canvas.nativeElement)
    // this.ctx = this.canvas.nativeElement.getContext('2d')!
  }

  selectImage(img: ImageFile) {
    this.store.patchState({ selectedFile: img })
    this.image$ = this.store.selectedImage$
  }
}
