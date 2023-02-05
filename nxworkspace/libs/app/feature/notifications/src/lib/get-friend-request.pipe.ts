import { inject, Pipe, PipeTransform } from '@angular/core'
import { Router } from '@angular/router'
import { AuthStoreService } from '@auth/data-access/facades'
import { ConnectionsService } from '@shared/data-access/connections'
import { NotificationModel } from '@shared/data-access/models'

@Pipe({
  name: 'getRequested',
  standalone: true,
})
export class GetFriendRequestPipe implements PipeTransform {
  private router = inject(Router)
  private authStore = inject(AuthStoreService)
  private connectionsService = inject(ConnectionsService)

  transform(request: any | undefined | null) {
    if (!request) return

    // return (request as NotificationModel).friendRequest.requestedByUserName
  }
}
