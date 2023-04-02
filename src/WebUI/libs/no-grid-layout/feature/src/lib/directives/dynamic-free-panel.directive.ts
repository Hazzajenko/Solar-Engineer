import { ComponentRef, Directive, Input, NgZone, OnDestroy, OnInit, ViewContainerRef } from '@angular/core'
import { FreePanelComponent } from '@no-grid-layout/feature'
import { FreeBlockType } from '@no-grid-layout/shared'

@Directive({
  selector:   '[appDynamicFreePanel]',
  standalone: true,
})
export class DynamicComponentDirective
  implements OnInit,
             OnDestroy {
  constructor(public viewContainerRef: ViewContainerRef, private _ngZone: NgZone) {
  }

  freePanelComponentComponentRef?: ComponentRef<FreePanelComponent>

  @Input() set entity(entity: {
    id: string;
    type: FreeBlockType
  }) {
    console.log('entity', entity)
    this._ngZone.runOutsideAngular(() => {
      switch (entity.type) {
        case FreeBlockType.Panel:
          this.createPanelComponent(entity.id)
          break
      }
    })
  }

  ngOnInit() {
    console.log(this.constructor.name, 'ngOnInit')
  }

  private createPanelComponent(entityId: string) {
    console.log('createPanelComponent', entityId)
    const _viewContainerRef = this.viewContainerRef
    _viewContainerRef.clear()

    this.freePanelComponentComponentRef =
      _viewContainerRef.createComponent<FreePanelComponent>(FreePanelComponent)

    this.freePanelComponentComponentRef.instance.panelId = entityId
  }

  ngOnDestroy(): void {
    console.log('destroy')
    this.freePanelComponentComponentRef?.destroy()
  }
}
