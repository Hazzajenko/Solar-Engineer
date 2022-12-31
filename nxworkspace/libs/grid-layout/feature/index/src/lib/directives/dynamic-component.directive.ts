import { ComponentRef, Directive, Input, OnDestroy, ViewContainerRef } from '@angular/core'
import { BlockPanelComponent } from '@project-id/feature/blocks'
import { BlockModel, BlockType } from '@shared/data-access/models'

@Directive({
  selector: '[appDynamic]',
  standalone: true,
})
export class DynamicComponentDirective implements OnDestroy {
  constructor(public viewContainerRef: ViewContainerRef) {}
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
    }
  }

  ngOnDestroy(): void {
    this.panelComponentRef?.destroy()
  }
}
