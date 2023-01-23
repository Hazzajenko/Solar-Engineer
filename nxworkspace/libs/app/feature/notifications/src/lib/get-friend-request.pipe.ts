import { Pipe, PipeTransform } from '@angular/core'
import { NotificationModel } from '@shared/data-access/models'

@Pipe({
  name: 'getRequested',
  standalone: true,
})
export class GetFriendRequestPipe implements PipeTransform {

  transform(request: any | undefined | null) {
    if (!request) return
    return (request as NotificationModel).friendRequest.requestedByUsername
  }
}
