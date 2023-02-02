import { Pipe, PipeTransform } from '@angular/core'
import { ImageModel, S3ImageModel } from '@shared/data-access/models'

export const IMAGE_URL = 'https://dfnxlos83r7s4.cloudfront.net/'

@Pipe({
  name: 'getFullUrl',
  standalone: true,
})
export class GetFullUrlPipe implements PipeTransform {
  transform(image: ImageModel | S3ImageModel | undefined | null) {
    if (!image) return
    if ('publicId' in image) {
      return `${IMAGE_URL}${image.publicId}.png`
    }
    return `${IMAGE_URL}${image.imageName}`
  }
}
