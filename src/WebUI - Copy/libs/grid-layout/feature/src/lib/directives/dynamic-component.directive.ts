import { ComponentRef, Directive, Input, NgZone, OnDestroy, ViewContainerRef } from '@angular/core'
import { BlockPanelComponent } from '../feature/block-panel'
import { BLOCK_TYPE, BlockModel, ProjectModelType } from '@shared/data-access/models'

@Directive({
  selector: '[appDynamic]',
  standalone: true,
})
export class DynamicComponentDirective implements OnDestroy {
  constructor(public viewContainerRef: ViewContainerRef, private _ngZone: NgZone) {}

  // private stringsFacade = inject(StringsFacade)

  // constructor(private cdr: ChangeDetectorRef) { }

  // Wait until the view inits before disconnecting
  /*  ngAfterViewInit() {
      // Since we know the list is not going to change
      // let's request that this component not undergo change detection at all
      this.cdr.detach()
    }*/

  panelComponentRef?: ComponentRef<BlockPanelComponent>

  /*  ngAfterViewInit(): void {
      this.cdr.detach()
    }*/

  @Input() set blockId(block: { blockId: string; blockType: ProjectModelType }) {
    // this._ngZone.runOutsideAngular(() => {
    const _viewContainerRef = this.viewContainerRef

    _viewContainerRef.clear()
    if (block.blockType === BLOCK_TYPE.PANEL) {
      /*       const panelComponentRef =
        _viewContainerRef.createComponent<BlockPanelComponent>(BlockPanelComponent) */

      this.panelComponentRef =
        _viewContainerRef.createComponent<BlockPanelComponent>(BlockPanelComponent)

      // panelComponentRef.instance.id = block.id

      this.panelComponentRef.instance.id = block.blockId
    }
    /*      console.log(block)
          console.log((block as any).stringId)
          if (block instanceof PanelModel) {


            // this.panelComponentRef.instance.panel = block
          }*/

    // })
  }

  @Input() set block(block: BlockModel) {
    // this._ngZone.runOutsideAngular(() => {
    const _viewContainerRef = this.viewContainerRef

    _viewContainerRef.clear()

    if (block.type === BLOCK_TYPE.PANEL) {
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
    // })
  }

  ngOnDestroy(): void {
    this.panelComponentRef?.destroy()
  }
}
