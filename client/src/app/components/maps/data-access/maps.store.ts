import { ComponentStore } from '@ngrx/component-store'
import { inject, Injectable } from '@angular/core'
import { map, switchMap } from 'rxjs/operators'
import { ImagesService } from '../../../shared/data-access/images/images.service'
import { ImageRequest } from '../../../shared/models/images/image-request'
import { Observable } from 'rxjs'

interface MapsState {}

@Injectable()
export class MapsStore extends ComponentStore<MapsState> {
  private imagesService = inject(ImagesService)
  readonly uploadImage = this.effect((imageReq$: Observable<ImageRequest>) =>
    imageReq$.pipe(
      map((params) => params),
      switchMap((req) => this.imagesService.saveImage(req)),
    ),
  )

  constructor() {
    super({})
  }
}
