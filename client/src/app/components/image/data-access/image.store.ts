import { ComponentStore } from '@ngrx/component-store'
import { inject, Injectable } from '@angular/core'
import { ImagesService } from '../../../shared/data-access/images/images.service'
import { combineLatestWith, EMPTY, Observable, of, switchMap, tap } from 'rxjs'
import { ImageFile } from '../../../shared/models/images/image-list-response'
import { map } from 'rxjs/operators'

interface ImageState {
  loadedImage?: HTMLImageElement
  selectedFile?: ImageFile
  imageList?: ImageFile[]
  loadingImage: boolean
}

@Injectable()
export class ImageStore extends ComponentStore<ImageState> {
  loadedImage$ = this.select((state) => state.loadedImage)
  selectedFile$ = this.select((state) => state.selectedFile)
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

  readonly selectedImage$ = this.select((state) => state.loadedImage).pipe(
    combineLatestWith(this.selectedFile$),
    switchMap(([image, file]) => {
      if (!file) return EMPTY
      if (image) {
        return of(image)
      }
      return this.imagesService.getImageByName(file.name).pipe(
        tap((res) => {
          this.patchState({ loadedImage: res })
        }),
      )
    }),
  )

  readonly imageList$ = this.select((state) => state.imageList).pipe(
    switchMap((images) => {
      if (images) {
        return of(images)
      }
      return this.imagesService.getImageList().pipe(
        tap((res) => {
          console.log(res)
          this.patchState({ imageList: res })
        }),
      )
    }),
  )
  readonly getImageByName = this.effect((imageFile$: Observable<ImageFile>) =>
    imageFile$.pipe(
      map((params) => params),
      switchMap((req) => this.imagesService.getImageByName(req.name)),
    ),
  )

  constructor() {
    super({
      loadedImage: undefined,
      loadingImage: false,
      imageList: undefined,
      selectedFile: undefined,
    })
  }
}
