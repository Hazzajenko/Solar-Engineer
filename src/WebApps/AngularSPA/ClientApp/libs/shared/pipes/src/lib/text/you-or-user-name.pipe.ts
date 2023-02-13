import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'youOrUserName',
  standalone: true,
})
export class YouOrUserNamePipe implements PipeTransform {
  transform(userName: string | undefined | null, appUserName: string) {
    if (!userName || !appUserName) return
    if (userName === appUserName) return 'You'
    return userName
  }
}
