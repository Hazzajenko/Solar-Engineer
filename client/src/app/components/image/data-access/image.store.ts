import { ComponentStore } from '@ngrx/component-store'
import { inject, Injectable } from '@angular/core'
import { ImagesService } from './images.service'
import { of, switchMap, tap } from 'rxjs'

interface ImageState {
  loadedImage?: HTMLImageElement
  loadingImage: boolean
}

@Injectable()
export class ImageStore extends ComponentStore<ImageState> {
  loadedImage$ = this.select((state) => state.loadedImage)
  loadingImage$ = this.select((state) => state.loadingImage)
  private imagesService = inject(ImagesService)
  readonly image$ = this.select((state) => state.loadedImage).pipe(
    switchMap((image) => {
      if (image) {
        return of(image)
      }
      return this.imagesService.getImage().pipe(
        tap((res) => {
          this.patchState({ loadedImage: res })
        }),
      )
    }),
  )

  constructor() {
    super({
      loadedImage: undefined,
      loadingImage: false,
    })
  }
}
