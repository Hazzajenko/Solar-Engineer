import { ComponentRef, Directive, inject, Input, OnDestroy, ViewContainerRef } from '@angular/core'
import { BlockPanelComponent } from '../feature/block-panel'
import { StringsFacade } from '@project-id/data-access/facades'
import { BlockModel, BlockType } from '@shared/data-access/models'

@Directive({
  selector: '[appDynamic]',
  standalone: true,
})
export class DynamicComponentDirective implements OnDestroy {
  constructor(public viewContainerRef: ViewContainerRef) {}

  private stringsFacade = inject(StringsFacade)

  panelComponentRef?: ComponentRef<BlockPanelComponent>

  @Input() set block(block: BlockModel) {
    const _viewContainerRef = this.viewContainerRef

    _viewContainerRef.clear()

    if (block.type === BlockType.PANEL) {
      /*       const panelComponentRef =
        _viewContainerRef.createComponent<BlockPanelComponent>(BlockPanelComponent) */

      this.panelComponentRef =
        _viewContainerRef.createComponent<BlockPanelComponent>(BlockPanelComponent)

      // panelComponentRef.instance.id = block.id

      this.panelComponentRef.instance.id = block.id
      /*      console.log(block)
            console.log((block as any).stringId)
            if (block instanceof PanelModel) {


              // this.panelComponentRef.instance.panel = block
            }*/
    }
  }

  ngOnDestroy(): void {
    this.panelComponentRef?.destroy()
  }
}
