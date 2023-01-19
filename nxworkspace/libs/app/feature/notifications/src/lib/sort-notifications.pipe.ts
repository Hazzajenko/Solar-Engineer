import { Pipe, PipeTransform } from '@angular/core'
import { NotificationModel } from '@shared/data-access/models'

@Pipe({
  name: 'sortNotifications',
  standalone: true,
})
export class SortNotificationsPipe implements PipeTransform {

  transform(notifications: NotificationModel[] | undefined | null, unreadFilter: boolean) {
    if (!notifications) return

    const result: NotificationModel[] = [...notifications]

    const sortByTimeCreated = result.sort((a: NotificationModel, b: NotificationModel) => {
      return new Date(b.requestTime).getTime() - new Date(a.requestTime).getTime()
    })

    if (!unreadFilter) return sortByTimeCreated

    return sortByTimeCreated.sort((a: NotificationModel, b: NotificationModel) => {
      return a.status - b.status
    })

    // return unReadNotifications
  }
}

/*

export enum NotificationStatus {
  Unread,
  Read
}*/
