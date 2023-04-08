import { ComponentRef, Directive, inject, Input, NgZone, OnDestroy, OnInit, ViewContainerRef } from '@angular/core'
import { DesignPanelComponent } from '@design-app/feature-panel'
import { DesignEntityType } from '@design-app/shared'

@Directive({
  selector:   '[appDynamicEntity]',
  standalone: true,
})
export class DynamicComponentDirective
  implements OnInit,
             OnDestroy {
  private _ngZone = inject(NgZone)
  private _viewContainerRef = inject(ViewContainerRef)

  designPanelComponentRef?: ComponentRef<DesignPanelComponent>

  @Input() set entity(entity: {
    id: string;
    type: DesignEntityType
  }) {
    console.log('entity', entity)
    this._ngZone.runOutsideAngular(() => {
      switch (entity.type) {
        case DesignEntityType.Panel:
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
      this._viewContainerRef.createComponent<DesignPanelComponent>(DesignPanelComponent)

    this.designPanelComponentRef.instance.panelId = entityId
  }

  ngOnDestroy(): void {
    console.log('destroy')
    this.designPanelComponentRef?.destroy()
  }
}
