import { ComponentRef, Directive, inject, Input, NgZone, OnDestroy, OnInit, ViewContainerRef } from '@angular/core'
import { PanelComponent } from '@design-app/feature-panel'
import { EntityType } from '@design-app/shared'

@Directive({
  selector:   '[appDynamicEntity]',
  standalone: true,
})
export class DynamicComponentDirective
  implements OnInit,
             OnDestroy {
  private _ngZone = inject(NgZone)
  private _viewContainerRef = inject(ViewContainerRef)

  designPanelComponentRef?: ComponentRef<PanelComponent>

  @Input() set entity(entity: {
    id: string;
    type: EntityType
  }) {
    console.log('entity', entity)
    this._ngZone.runOutsideAngular(() => {
      switch (entity.type) {
        case EntityType.Panel:
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
    this._viewContainerRef.clear()

    this.designPanelComponentRef =
      this._viewContainerRef.createComponent<PanelComponent>(PanelComponent)

    this.designPanelComponentRef.instance.panelId = entityId
  }

  ngOnDestroy(): void {
    console.log('destroy')
    this.designPanelComponentRef?.destroy()
  }
}
