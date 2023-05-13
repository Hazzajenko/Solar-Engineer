import { Pipe, PipeTransform } from '@angular/core'
import { S3ImageModel } from '@shared/data-access/models'
import { IMAGE_URL } from './get-cdn-url-string.pipe'

@Pipe({
  name: 'getFullUrl',
  standalone: true,
})
export class GetFullUrlPipe implements PipeTransform {
  transform(image: S3ImageModel | undefined | null) {
    if (!image) return
    return `${IMAGE_URL}${image.imageName}`
  }
}
