
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { BlockModel } from '@shared/data-access/models'
import { BlockPanelComponent } from './block-panel'
import { BlockDisconnectionPointComponent } from './block-disconnection-point'
import { BlockTrayComponent } from './block-tray'




@Component({
  selector: 'app-block-switch',
  standalone: true,
  imports: [
    CommonModule,
    BlockPanelComponent,
    BlockDisconnectionPointComponent,
    BlockTrayComponent,
  ],
  templateUrl: './block-switch.component.html',
  styleUrls: ['./block-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockSwitchComponent {
  @Input() block!: BlockModel
}
