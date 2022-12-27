import { Directive, Input, ViewContainerRef } from '@angular/core'
import { BlockPanelComponent } from '@project-id/feature/blocks'
import { BlockModel, BlockType } from '@shared/data-access/models'

@Directive({
  selector: '[appDynamic]',
  standalone: true,
})
export class DynamicComponentDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
  @Input() set block(block: BlockModel) {
    const _viewContainerRef = this.viewContainerRef

    _viewContainerRef.clear()

    if (block.type === BlockType.PANEL) {
      const panelComponentRef =
        _viewContainerRef.createComponent<BlockPanelComponent>(BlockPanelComponent)

      panelComponentRef.instance.id = block.id
    }
  }
}
