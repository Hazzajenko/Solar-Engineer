import { Directive, OnDestroy } from '@angular/core'
import { Subject } from 'rxjs'

@Directive({
  selector: '[appOnDestroyDirective]',
  standalone: true,
})
export class OnDestroyDirective implements OnDestroy {
  private _destroy$ = new Subject()

  get destroy$() {
    return this._destroy$.asObservable()
  }

  ngOnDestroy() {
    this._destroy$.next(true)
    this._destroy$.complete()
  }
}
