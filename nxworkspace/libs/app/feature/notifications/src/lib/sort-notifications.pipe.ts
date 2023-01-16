import { Inject, inject, Pipe, PipeTransform } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { AuthStoreService } from '@auth/data-access/facades'
import { BlockModel, NotificationModel, UserModel } from '@shared/data-access/models'
import { AuthDialog } from 'libs/home/ui/src/lib/dialogs/auth/auth.dialog'
import { ConnectionsService } from '@shared/data-access/connections'

@Pipe({
  name: 'sortNotifications',
  standalone: true,
})
export class SortNotificationsPipe implements PipeTransform {
  private router = inject(Router)
  private authStore = inject(AuthStoreService)
  private connectionsService = inject(ConnectionsService)

  transform(notifications: NotificationModel[] | undefined | null) {
    if (!notifications) return

    return notifications.sort((a: NotificationModel, b: NotificationModel) => {
      return new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime()
    })
  }
}
