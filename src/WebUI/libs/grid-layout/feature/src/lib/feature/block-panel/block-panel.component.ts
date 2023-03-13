import { DragDropModule } from '@angular/cdk/drag-drop'
import {
  AsyncPipe,
  NgClass,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgTemplateOutlet,
} from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core'

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { MatTooltipModule } from '@angular/material/tooltip'

import { PanelLinkComponent } from '../shared-ui/panel-link/panel-link.component'

import { LetModule } from '@ngrx/component'
// import {  } from '@project-id/data-access/services'
import { PanelMenuComponent } from './menu/panel-menu.component'
// import {  } from '@project-id/data-access/services'
import { Observable } from 'rxjs'
import { PanelDirective } from './directives/panel.directive'
import { PanelRotationComponent } from './ui/panel-rotation.component'
import { BaseService } from '@shared/logger'
import { BlockPanelService } from './block-panel.service'
import { PanelComponentState } from './models/panel-component.state'

@Component({
  selector: 'app-block-panel',
  templateUrl: './block-panel.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    MatTooltipModule,
    NgStyle,
    NgIf,
    AsyncPipe,
    LetModule,
    MatMenuModule,
    NgTemplateOutlet,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    PanelLinkComponent,
    PanelDirective,
    PanelMenuComponent,
    PanelRotationComponent,
  ],
  providers: [BlockPanelService],
  standalone: true,
})
export class BlockPanelComponent extends BaseService {
  componentState$!: Observable<PanelComponentState | undefined>
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger

  private blockPanelService = inject(BlockPanelService)

  @Input() set id(id: string) {
    this.componentState$ = this.blockPanelService.panelComponentState$(id)
  }

  onRightClick(event: MouseEvent, state: PanelComponentState) {
    event.preventDefault()
    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { state }
    this.matMenuTrigger.openMenu()
  }
}
