
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { BlockPanelComponent } from '@project-id/feature/blocks'
import { BlockModel } from '@shared/data-access/models'

@Component({
  selector: 'app-block-switch',
  standalone: true,
  imports: [CommonModule, BlockPanelComponent],
  templateUrl: './block-switch.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockSwitchComponent {
  @Input() block!: BlockModel
  // @Input() block$!: Observable<BlockModel | undefined>
}
