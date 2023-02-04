import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'
import { Directive, ElementRef, inject, Input } from '@angular/core'
import {
  GroupChatMessageModel,
  MessageModel,
  MessageWebUserModel,
} from '@shared/data-access/models'

@Directive({
  selector: '[appScrollViewportDirective]',
  standalone: true,
})
export class ScrollViewportDirective {
  private elRef = inject(ElementRef)
  private _viewport!: CdkVirtualScrollViewport
  private _messages: MessageWebUserModel[] = []
  private _groupChatMessages: GroupChatMessageModel[] = []
  private _scrollIndex = 0
  private _recipient = ''
  loaded = false

  messagesLoaded: boolean[] = []

  @Input() isGroup = false

  @Input() set viewport(viewport: CdkVirtualScrollViewport) {
    // this.loaded = false
    this._viewport = viewport
    this.scrollToBottom()
  }

  @Input() set recipient(recipient: string | undefined) {
    if (!recipient) return
    // this.loaded = false
    // this._viewport = viewport
    if (recipient !== this._recipient) {
      this.scrollToBottom()
      this._recipient = recipient
    }
  }

  @Input() set scrollIndex(scrollIndex: number) {
    this._scrollIndex = scrollIndex

    if (!this.loaded) {
      this.scrollToBottom()
      return
    }
  }

  @Input() set groupChatMessages(messages: GroupChatMessageModel[] | undefined | null) {
    if (!messages) return

    this._groupChatMessages = messages

    if (!this.loaded) {
      this.scrollToBottom()
      this.loaded = true
      return
    }

    if (!this.isNearBottom()) return

    this.scrollToBottom()
  }

  @Input() set messages(messages: MessageWebUserModel[] | undefined | null) {
    if (!messages) return

    this._messages = messages

    if (!this.loaded) {
      this.scrollToBottom()
      this.loaded = true
      return
    }

    if (!this.isNearBottom()) return

    this.scrollToBottom()
  }

  private scrollToBottom() {
    setTimeout(() => {
      this._viewport.scrollTo({
        bottom: 0,
        behavior: 'auto',
      })
    }, 0)
    setTimeout(() => {
      this._viewport.scrollTo({
        bottom: 0,
        behavior: 'auto',
      })
    }, 50)
    setTimeout(() => {
      this._viewport.scrollTo({
        bottom: 0,
        behavior: 'auto',
      })
    }, 100)
  }

  private isNearBottom() {
    if (this.isGroup) {
      return this._scrollIndex > this._groupChatMessages.length - 10
    }
    return this._scrollIndex > this._messages.length - 10
  }
}
