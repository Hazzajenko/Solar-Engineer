import { Pipe, PipeTransform } from '@angular/core'

export const IMAGE_URL = 'https://dfnxlos83r7s4.cloudfront.net/'

@Pipe({
  name: 'getCdnUrlString',
  standalone: true,
})
export class GetCdnUrlStringPipe implements PipeTransform {
  transform(image: string | undefined | null) {
    if (!image) return

    return `${IMAGE_URL}${image}`
  }
}
