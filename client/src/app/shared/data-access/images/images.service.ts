import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpEvent } from '@angular/common/http'
import { catchError, map, switchMap, take } from 'rxjs/operators'
import { defer, EMPTY, from, Observable } from 'rxjs'
import { ImageRequest } from '../../models/images/image-request'
import { ImageFile } from '../../models/images/image-list-response'
import { ImageResponse } from '../../models/images/image-response'

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private http = inject(HttpClient)

  getImageByName(name: string): Observable<HTMLImageElement> {
    return this.http.get(`/api/files/image/${name}`, { responseType: 'blob' }).pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: Blob) => this.createImageFromBlob(res)),
    )
  }

  getImage(): Observable<HTMLImageElement> {
    return this.http.get('/api/files/background', { responseType: 'blob' }).pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: Blob) => this.createImageFromBlob(res)),
    )
  }

  getImageList(): Observable<ImageFile[]> {
    return this.http.get<ImageFile[]>('/api/files/get-images').pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: ImageFile[]) => res),
    )
  }

  saveImageWithObs(request: ImageRequest): Observable<HttpEvent<any>> {
    const dataUrl$ = defer(() => this.getBase64DataFromUrl(request.imageUrl))
    return from(dataUrl$).pipe(
      map((dataUrl) => this.convertDataToBlob(dataUrl)),
      map((blob) => {
        const formData = new FormData()
        formData.append('file', blob, `${request.imageName}.png`)
        return formData
      }),
      switchMap((formData) =>
        this.http.post('/api/files/map', formData, { reportProgress: true, observe: 'events' }),
      ),
    )
  }

  saveImage(request: ImageRequest): Observable<ImageResponse> {
    let blob = new Blob()
    this.getBase64DataFromUrl(request.imageUrl).then((dataUrl) => {
      console.log('dataUrl', dataUrl)
      blob = this.convertDataToBlob(`${dataUrl}`)
    })
    console.log('blob', blob)
    const formData = new FormData()
    formData.append('file', blob, `${request.imageName}.png`)
    return this.http.post<ImageResponse>('/api/files/map', formData).pipe(
      take(5),
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: ImageResponse) => {
        console.log(res)
        return res
      }),
    )
  }

  saveImageWithProgress(request: ImageRequest): Observable<HttpEvent<any>> {
    let blob = new Blob()
    this.getBase64DataFromUrl(request.imageUrl).then((dataUrl) => {
      blob = this.convertDataToBlob(`${dataUrl}`)
    })
    const formData = new FormData()
    formData.append('file', blob, `${request.imageName}.png`)
    return this.http.post('/api/files/map', formData, { reportProgress: true, observe: 'events' })
  }

  private createImageFromBlob(blob: Blob): HTMLImageElement {
    let image = new Image()
    this.convertBlobToString(blob).then((base64data) => {
      image.src = `${base64data}`
    })

    return image
  }

  private convertDataToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  private async getBase64DataFromUrl(url: string): Promise<string> {
    const data = await fetch(url)
    const blob = await data.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        const base64data = reader.result
        resolve(base64data!.toString())
      }
    })
  }

  private async convertBlobToString(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        const base64data = reader.result
        resolve(base64data)
      }
    })
  }
}
