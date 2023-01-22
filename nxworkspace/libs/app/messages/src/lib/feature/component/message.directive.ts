import { Directive, ElementRef, inject, Input } from '@angular/core'
import { MessageModel, NotificationStatus } from '@shared/data-access/models'


@Directive({
  selector: '[appMessageDirective]',
  standalone: true,
})
export class MessageDirective {
  private elRef = inject(ElementRef)
  private _message!: MessageModel
  private _username?: string

  @Input() set username(username: string | undefined) {
    if (!username) return
    this._username = username
  }

  @Input() set message(message: MessageModel) {
    if (!message) return
    if (!this._username) return
    this._message = message

    if (message.status === NotificationStatus.Unread && message.senderUsername !== this._username) {
      this.elRef.nativeElement.style.backgroundColor = '#60a1fa'
    } else {
      this.elRef.nativeElement.style.backgroundColor = ''
    }
  }

  @Input() set filter(filter: boolean) {
    if (this._message.status === NotificationStatus.Unread) {
      this.elRef.nativeElement.style.backgroundColor = '#60a1fa'
    } else {
      this.elRef.nativeElement.style.backgroundColor = ''
    }
  }


  @Input() set selectedMessage(message: MessageModel | undefined) {
    if (!message) return

    if (message.id === this._message.id) {
      // this.elRef.nativeElement.style.backgroundColor = '#253fff'
      // this.elRef.nativeElement.style.backgroundColor = 'rgb(194, 222, 209)'
      this.elRef.nativeElement.style.backgroundColor = '#a9deff'
      this.elRef.nativeElement.style.border = '1px solid rgb(84, 73, 116)'
      // this.elRef.nativeElement.style.fontSize = 'large'
    } else {
      this.elRef.nativeElement.style.backgroundColor = ''
      this.elRef.nativeElement.style.border = ''
      // this.elRef.nativeElement.style.fontSize = ''
      if (this._message.status === NotificationStatus.Unread) {
        this.elRef.nativeElement.style.backgroundColor = '#60a1fa'
        // this.elRef.nativeElement.style.backgroundColor = '#3f96ff'
      } else {
        this.elRef.nativeElement.style.backgroundColor = ''
      }
    }
  }
}
