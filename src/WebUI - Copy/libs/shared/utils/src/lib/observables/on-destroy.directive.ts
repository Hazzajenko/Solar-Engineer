import { Directive, OnDestroy } from '@angular/core'
import { Subject } from 'rxjs'

@Directive({
  selector:   '[appOnDestroy]',
  standalone: true,
})
export class OnDestroyDirective
  implements OnDestroy {
  private _destroy$ = new Subject()

  get destroy$() {
    return this._destroy$
  }

  ngOnDestroy(): void {
    this._destroy$.next(true)
    this._destroy$.complete()
  }
}