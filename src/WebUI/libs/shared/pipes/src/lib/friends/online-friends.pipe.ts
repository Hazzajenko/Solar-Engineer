import { Pipe, PipeTransform } from '@angular/core'
import { FriendModel } from '@shared/data-access/models'

@Pipe({
  name: 'onlineFriends',
  standalone: true,
})
export class OnlineFriendsPipe implements PipeTransform {
  transform(friends: FriendModel[] | undefined | null) {
    if (!friends) return

    const onlineFriends = friends.filter(friend => friend.online)

    return onlineFriends.length
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
