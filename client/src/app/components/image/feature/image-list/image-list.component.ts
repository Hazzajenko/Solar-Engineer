import { Component, EventEmitter, inject, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ImageStore } from '../../data-access/image.store'
import { Observable } from 'rxjs'
import { ImageFile } from '../../../../shared/models/images/image-list-response'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-image-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
})
export class ImageListComponent {
  @Output() imageSelected: EventEmitter<boolean> = new EventEmitter<boolean>()
  private store = inject(ImageStore)
  imageList$: Observable<ImageFile[]> = this.store.imageList$

  selectImage(img: ImageFile) {
    this.store.patchState({ selectedFile: img })
    this.imageSelected.emit(true)
  }
}
