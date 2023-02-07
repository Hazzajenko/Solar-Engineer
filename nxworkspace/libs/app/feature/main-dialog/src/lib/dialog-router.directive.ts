import { ComponentRef, Directive, Input, OnDestroy, ViewContainerRef } from '@angular/core'
import { DialogRouteType } from './dialog.routes'
import { AppUserProfileComponent } from '@app/feature/app-user-profile'

@Directive({
  selector: '[appDialogRouter]',
  standalone: true,
})
export class DialogRouterDirective implements OnDestroy {
  constructor(public viewContainerRef: ViewContainerRef) {}

  routeComponentRef?: ComponentRef<any>

  @Input() set route(route: DialogRouteType | undefined | null) {
    if (!route) return
    const _viewContainerRef = this.viewContainerRef

    _viewContainerRef.clear()
    this.routeComponentRef = _viewContainerRef.createComponent(route)
  }

  getObh() {
    return AppUserProfileComponent
  }

  ngOnDestroy(): void {
    this.routeComponentRef?.destroy()
  }
}
