import { Directive, ElementRef, inject, Input } from '@angular/core'
import { NotificationModel, NotificationStatus } from '@shared/data-access/models'


@Directive({
  selector: '[appNotificationDirective]',
  standalone: true,
})
export class NotificationDirective {
  private elRef = inject(ElementRef)
  private _notification!: NotificationModel

  @Input() set notification(notification: NotificationModel) {
    if (!notification) return
    this._notification = notification

    if (notification.status === NotificationStatus.Unread) {
      this.elRef.nativeElement.style.backgroundColor = '#60a1fa'
    }
  }

  @Input() set selectedNotification(notification: NotificationModel | undefined) {
    if (!notification) return

    if (notification.id === this._notification.id) {
      // this.elRef.nativeElement.style.backgroundColor = '#253fff'
      this.elRef.nativeElement.style.backgroundColor = 'rgb(194, 222, 209)'
      this.elRef.nativeElement.style.border = '1px solid rgb(84, 73, 116)'
      // this.elRef.nativeElement.style.fontSize = 'large'
    } else {
      this.elRef.nativeElement.style.backgroundColor = ''
      this.elRef.nativeElement.style.border = ''
      // this.elRef.nativeElement.style.fontSize = ''
      if (this._notification.status === NotificationStatus.Unread) {
        this.elRef.nativeElement.style.backgroundColor = '#60a1fa'
      } else {
        this.elRef.nativeElement.style.backgroundColor = ''
      }
    }
  }
}
