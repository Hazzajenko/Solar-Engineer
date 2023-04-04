import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core'
import { ScreenMoveService } from '@no-grid-layout/utils'

@Directive({
  selector:   '[appKeyUpDirective]',
  standalone: true,
})
export class KeyUpDirective
  implements OnInit {
  private _element = inject(ElementRef<HTMLDivElement>).nativeElement
  private _renderer = inject(Renderer2)
  private _screenMoveService = inject(ScreenMoveService)

  ngOnInit(): void {
    this._renderer.listen(window, 'keyup', (event: KeyboardEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onKeyUpHandler(event)
    })
  }

  private onKeyUpHandler(event: KeyboardEvent) {
    console.log('onKeyUpHandler', event.key)
    switch (event.key) {
      case 'r': {
        this._screenMoveService.resetScreenPosition()
      }
    }
  }

}
