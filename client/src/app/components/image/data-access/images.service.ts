import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators'
import { EMPTY, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private http = inject(HttpClient)

  getImage(): Observable<HTMLImageElement> {
    return this.http.get('/api/files/background', { responseType: 'blob' }).pipe(
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
