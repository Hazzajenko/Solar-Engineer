import { Directive, ElementRef, inject, Input } from '@angular/core'
import {
  GroupChatMessageMemberModel,
  GroupChatMessageModel,
  MessageFrom,
  MessageModel,
} from '@shared/data-access/models'

@Directive({
  selector: '[appConversationMessageDirective]',
  standalone: true,
})
export class ConversationMessageDirective {
  private elRef = inject(ElementRef)
  private _message!: MessageModel
  private _groupChatMessage!: GroupChatMessageModel
  private _userName!: string

  @Input() set userName(userName: string) {
    if (!userName) return
    this._userName = userName
  }

  @Input() set groupChatMessage(message: GroupChatMessageMemberModel) {
    if (!message) return
    // this._groupChatMessage = message
    // if (message.messageFrom === MessageFrom.Server) console.log(message)
    switch (message.messageFrom) {
      case MessageFrom.OtherUser: {
        this.elRef.nativeElement.style.flexDirection = 'row'
        return
      }
      case MessageFrom.CurrentUser: {
        this.elRef.nativeElement.style.flexDirection = 'row-reverse'
        this.elRef.nativeElement.style.boxRadius = '15px 15px 0px 15px'
        return
      }
      case MessageFrom.Server: {
        this.elRef.nativeElement.style.alignItems = 'center'
        this.elRef.nativeElement.style.justifyContent = 'center'
        this.elRef.nativeElement.style.flexDirection = 'row'
        return
      }
      case MessageFrom.Unknown: {
        console.error(message)
        return
      }
    }
    /*    if (message.sender.isServer) {
          this.elRef.nativeElement.style.alignItems = 'center'
          this.elRef.nativeElement.style.justifyContent = 'center'
          this.elRef.nativeElement.style.flexDirection = 'row'
          // this.elRef.nativeElement.style.boxRadius = '15px 15px 0px 15px'
          return
        }
        if (this._userName === message.senderUserName) {
          this.elRef.nativeElement.style.flexDirection = 'row-reverse'
          this.elRef.nativeElement.style.boxRadius = '15px 15px 0px 15px'
        } else {
          this.elRef.nativeElement.style.flexDirection = 'row'
        }*/
  }

  @Input() set message(message: MessageModel) {
    if (!message) return
    this._message = message

    if (this._userName === message.senderUserName) {
      // this.elRef.nativeElement.style.backgroundColor = '#60a1fa'
      this.elRef.nativeElement.style.flexDirection = 'row-reverse'
      this.elRef.nativeElement.style.boxRadius = '15px 15px 0px 15px'
      // console.log(this.elRef.nativeElement.style.boxRadius)
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
