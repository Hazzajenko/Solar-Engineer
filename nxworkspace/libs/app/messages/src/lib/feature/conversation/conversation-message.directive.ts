import { Directive, ElementRef, inject, Input } from '@angular/core'
import { MessageModel, NotificationStatus } from '@shared/data-access/models'


@Directive({
  selector: '[appConversationMessageDirective]',
  standalone: true,
})
export class ConversationMessageDirective {
  private elRef = inject(ElementRef)
  private _message!: MessageModel
  private _username!: string

  @Input() set username(username: string) {
    if (!username) return
    this._username = username
  }

  @Input() set message(message: MessageModel) {
    if (!message) return
    this._message = message

    if (this._username === message.senderUsername) {
      // this.elRef.nativeElement.style.backgroundColor = '#60a1fa'
      this.elRef.nativeElement.style.flexDirection = 'row-reverse'
      this.elRef.nativeElement.style.boxRadius = '15px 15px 0px 15px'
      console.log(this.elRef.nativeElement.style.boxRadius)
      // border-radius: 15px 50px 30px 5px;
      // this.elRef.nativeElement.style.justifyContent = 'flex-end'
      // this.elRef.nativeElement.style.textAlign = 'end'

    } else {
      // this.elRef.nativeElement.style.backgroundColor = ''
      this.elRef.nativeElement.style.flexDirection = 'row'
      // this.elRef.nativeElement.style.justifyContent = 'flex-start'
      // this.elRef.nativeElement.style.textAlign = 'start'
    }
  }

  /*  Class
    Properties
    justify-start	justify-content: flex-start;
    justify-end	justify-content: flex-end;*/

}
