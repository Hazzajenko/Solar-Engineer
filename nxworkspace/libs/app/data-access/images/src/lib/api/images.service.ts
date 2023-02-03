import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, map, Observable, Subject } from 'rxjs'
import { S3ImageModel } from '@shared/data-access/models'
import { GetDefaultImagesResponse } from '../models/get-default-images.response'

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private http = inject(HttpClient)
  private _defaultImages = new BehaviorSubject<S3ImageModel[] | undefined>(undefined)
  private _defaultImages2 = new Subject<S3ImageModel[] | undefined>()
  defaultImages$: Observable<S3ImageModel[]> = this.http
    .get<GetDefaultImagesResponse>(`/api/images/default-dps`)
    .pipe(map((res) => res.images))

  /*
    getLoadedImages() {
      if (this._defaultImages.value) {
        return this._defaultImages
      }

      // this._defaultImages2.
    }*/
}
