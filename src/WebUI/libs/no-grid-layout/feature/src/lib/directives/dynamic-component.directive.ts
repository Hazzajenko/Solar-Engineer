import { ComponentRef, Directive, inject, Input, NgZone, OnDestroy, OnInit, ViewContainerRef } from '@angular/core'
import { FreePanelComponent } from '@no-grid-layout/feature'
import { FreeBlockType } from '@no-grid-layout/shared'
import { ComponentElementsService } from '@no-grid-layout/utils'

@Directive({
  selector:   '[appDynamicFreePanel]',
  standalone: true,
})
export class DynamicComponentDirective
  implements OnInit,
             OnDestroy {
  private _ngZone = inject(NgZone)
  private _viewContainerRef = inject(ViewContainerRef)
  private _componentElementsService = inject(ComponentElementsService)

  /*  constructor(public viewContainerRef: ViewContainerRef, private _ngZone: NgZone) {
   }*/

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
    // const _viewContainerRef = this._viewContainerRef
    this._viewContainerRef.clear()

    this.freePanelComponentComponentRef =
      this._viewContainerRef.createComponent<FreePanelComponent>(FreePanelComponent)

    this.freePanelComponentComponentRef.instance.panelId = entityId
    /*    const element = this.freePanelComponentComponentRef.location.nativeElement as HTMLDivElement
     // const childElement = element.children[0] as HTMLDivElement
     /!*    const findChildElement = (element: HTMLDivElement): HTMLDivElement => {
     if (element.children.length === 0) return element
     return findChildElement(element.children[0] as HTMLDivElement)
     }*!/
     // const childElement = element.children.namedItem()
     // element children to array
     const childElement = Array.from(element.children)
     .find((child) => child.tagName === 'DIV') as HTMLDivElement
     console.log('childElement', childElement)
     const childElementByPanelId = Array.from(element.children)
     .find((child) => child.id === entityId) as HTMLDivElement
     console.log('childElementByPanelId', childElementByPanelId)
     // const childElementByPanelId = element.querySelector(`[data-panel-id="${entityId}"]`) as HTMLDivElement
     this._componentElementsService.addToElements(childElementByPanelId)*/
  }

  ngOnDestroy(): void {
    console.log('destroy')
    this.freePanelComponentComponentRef?.destroy()
  }
}
