import { Inject, inject, Pipe, PipeTransform } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatLegacyListOption } from '@angular/material/legacy-list'
import { MatListOption } from '@angular/material/list'
import { Router } from '@angular/router'
import { AuthStoreService } from '@auth/data-access/facades'
import { BlockModel, FriendRequestModel, NotificationModel, UserModel } from '@shared/data-access/models'
import { AuthDialog } from 'libs/home/ui/src/lib/dialogs/auth/auth.dialog'
import { ConnectionsService } from '@shared/data-access/connections'

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


    return (request as NotificationModel).notification.requestedByUsername
  }
}
