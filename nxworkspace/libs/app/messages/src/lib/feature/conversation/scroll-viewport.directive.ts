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


  @Input() set viewport(viewport: CdkVirtualScrollViewport) {
    this._viewport = viewport
    this.scrollToBottom()
  }

  @Input() set scrollIndex(scrollIndex: number) {
    this._scrollIndex = scrollIndex
  }

  @Input() set messages(messages: MessageModel[] | undefined | null) {
    if (!messages) return
    this._messages = messages

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
  }

  private isNearBottom() {
    return (this._scrollIndex > this._messages.length - 10)
  }
}
