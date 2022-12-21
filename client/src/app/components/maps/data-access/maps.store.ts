import { ComponentStore } from '@ngrx/component-store'
import { inject, Injectable } from '@angular/core'
import { map, switchMap } from 'rxjs/operators'
import { ImagesService } from '../../../shared/data-access/images/images.service'
import { ImageRequest } from '../../../shared/models/images/image-request'
import { Observable, tap } from 'rxjs'
import { HttpEventType } from '@angular/common/http'

interface MapsState {
  uploadingImage: boolean
  uploadProgress?: number
}

@Injectable()
export class MapsStore extends ComponentStore<MapsState> {
  uploadingImage$ = this.select((state) => state.uploadingImage)
  uploadProgress$ = this.select((state) => state.uploadProgress)
  private imagesService = inject(ImagesService)
  readonly uploadImage = this.effect((imageReq$: Observable<ImageRequest>) =>
    imageReq$.pipe(
      map((params) => params),
      switchMap((req) => this.imagesService.saveImage(req)),
    ),
  )

  readonly uploadImageWithProgress = this.effect((imageReq$: Observable<ImageRequest>) =>
    imageReq$.pipe(
      map((params) => params),
      switchMap((req) =>
        this.imagesService.saveImageWithObs(req).pipe(
          tap((event) => {
            this.patchState({ uploadingImage: true })
            if (event.type === HttpEventType.UploadProgress) {
              this.patchState({ uploadProgress: Math.round((100 * event.loaded) / event.total!) })
            } else if (event.type === HttpEventType.Response) {
              this.patchState({ uploadingImage: false })
              this.patchState({ uploadProgress: undefined })
            }
          }),
        ),
      ),
    ),
  )

  constructor() {
    super({
      uploadingImage: false,
      uploadProgress: undefined,
    })
  }
}
