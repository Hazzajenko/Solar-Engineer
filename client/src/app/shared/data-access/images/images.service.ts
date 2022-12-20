import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators'
import { EMPTY, Observable } from 'rxjs'
import { ImageRequest } from '../../models/images/image-request'
import { ImageFile } from '../../models/images/image-list-response'

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

  async saveImageAsync(request: ImageRequest): Promise<Observable<HTMLImageElement>> {
    const dataUrl = await this.getBase64DataFromUrl(request.imageUrl)
    const blob: Blob = this.convertDataToBlob(`${dataUrl}`)

    const formData = new FormData()
    formData.append('file', blob, `${request.imageName}.png`)
    return this.http.post('/api/files/map', formData, { responseType: 'blob' }).pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: Blob) => this.createImageFromBlob(res)),
    )
  }

  saveImage(request: ImageRequest): Observable<HTMLImageElement> {
    let blob = new Blob()
    this.getBase64DataFromUrl(request.imageUrl).then((dataUrl) => {
      blob = this.convertDataToBlob(`${dataUrl}`)
    })

    const formData = new FormData()
    formData.append('file', blob, `${request.imageName}.png`)
    return this.http.post('/api/files/map', formData, { responseType: 'blob' }).pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: Blob) => this.createImageFromBlob(res)),
    )
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

  private async getBase64DataFromUrl(url: string) {
    const data = await fetch(url)
    const blob = await data.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        const base64data = reader.result
        resolve(base64data)
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
