import { Pipe, PipeTransform } from '@angular/core'
import { FriendModel } from '@shared/data-access/models'

@Pipe({
  name: 'sortFriends',
  standalone: true,
})
export class SortFriendsPipe implements PipeTransform {
  transform(friends: FriendModel[] | undefined | null) {
    if (!friends) return

    return friends.sort((a: FriendModel, b: FriendModel) => {
      return Number(a.online) - Number(b.online)
    })
    /*

        return sortByTimeCreated.sort((a: NotificationModel, b: NotificationModel) => {
          return a.status - b.status
        })
    */

    // return unReadNotifications
  }
}

/*

export enum NotificationStatus {
  Unread,
  Read
}*/
