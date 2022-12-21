import { Component, ElementRef, inject, ViewChild } from '@angular/core'
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
import { ImageListComponent } from './feature/image-list/image-list.component'
import { ImageCanvasComponent } from './feature/image-canvas/image-canvas.component'

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
    ImageListComponent,
    ImageCanvasComponent,
  ],
  providers: [ImageStore],
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>
  private store = inject(ImageStore)
  selectedImage$: Observable<HTMLImageElement> = this.store.selectedImage$

  imageList$: Observable<ImageFile[]> = this.store.imageList$
  private ctx!: CanvasRenderingContext2D

  selectImage(img: ImageFile) {
    this.store.patchState({ selectedFile: img })
    this.selectedImage$ = this.store.selectedImage$
  }
}
