import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'
import { Directive, ElementRef, inject, Input } from '@angular/core'
import { MessageModel } from '@shared/data-access/models'


@Directive({
  selector: '[appScrollViewportDirective]',
  standalone: true,
})
export class ScrollViewportDirective {
  private elRef = inject(ElementRef)
  private _viewport!: CdkVirtualScrollViewport
  private _messages: MessageModel[] = []
  private _scrollIndex = 0
  private _recipient = ''
  loaded = false

  messagesLoaded: boolean[] = []


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

  @Input() set messages(messages: MessageModel[] | undefined | null) {

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
    return (this._scrollIndex > this._messages.length - 10)
  }
}
