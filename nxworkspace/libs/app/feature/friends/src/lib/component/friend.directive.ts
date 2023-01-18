import { Directive, ElementRef, inject, Input } from '@angular/core'
import { FriendModel } from '@shared/data-access/models'


@Directive({
  selector: '[appFriendDirective]',
  standalone: true,
})
export class FriendDirective {
  private elRef = inject(ElementRef)
  private _friend!: FriendModel

  @Input() set friend(friend: FriendModel) {
    if (!friend) return
    this._friend = friend
    /*
        if (notification.status === NotificationStatus.Unread) {
          this.elRef.nativeElement.style.backgroundColor = '#60a1fa'
        }*/
  }

  @Input() set selectedFriend(friend: FriendModel | undefined) {
    if (!friend) return

    if (friend.username === this._friend.username) {
      // this.elRef.nativeElement.style.backgroundColor = '#253fff'
      this.elRef.nativeElement.style.backgroundColor = '#18FFFF'
      // this.elRef.nativeElement.style.backgroundColor = 'rgb(194, 222, 209)'
      this.elRef.nativeElement.style.border = '1px solid rgb(84, 73, 116)'
      // this.elRef.nativeElement.style.fontSize = 'large'
    } else {
      this.elRef.nativeElement.style.backgroundColor = ''
      this.elRef.nativeElement.style.border = ''
      /*      // this.elRef.nativeElement.style.fontSize = ''
            if (this._notification.status === NotificationStatus.Unread) {
              this.elRef.nativeElement.style.backgroundColor = '#60a1fa'
            } else {
              this.elRef.nativeElement.style.backgroundColor = ''
            }*/
    }
  }
}
