import { inject, Pipe, PipeTransform } from '@angular/core'
import { Router } from '@angular/router'
import { AuthStoreService } from '@auth/data-access'
import { ConnectionsSignalrService } from '@app/data-access/connections'

// import { NotificationModel } from '@shared/data-access/models'

@Pipe({
  name: 'getRequested',
  standalone: true,
})
export class GetFriendRequestPipe implements PipeTransform {
  private router = inject(Router)
  private authStore = inject(AuthStoreService)
  private connectionsService = inject(ConnectionsSignalrService)

  transform(request: any | undefined | null) {
    if (!request) return

    // return (request as NotificationModel).friendRequest.requestedByUserName
  }
}
