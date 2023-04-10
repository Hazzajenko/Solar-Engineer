import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { Observable } from 'rxjs'
import { DesignLayoutDirective } from './design-layout.directive'
import { KeyUpDirective } from '../../directives/key-up.directive'
import { ScrollViewDirective } from '../../directives/scroll-view.directive'
import { DynamicComponentDirective } from '../../directives/dynamic-component.directive'
import { ShowScreenPositionComponent } from './show-screen-position/show-screen-position.component'
import { DesignLayoutComponentStore, DesignLayoutViewModel } from './design-layout-component.store'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:         [
    CdkDrag,
    CommonModule,
    DesignLayoutDirective,
    ScrollViewDirective,
    DynamicComponentDirective,
    ShowScreenPositionComponent,
  ],
  hostDirectives:  [
    KeyUpDirective,
  ],
  selector:        'app-design-layout',
  standalone:      true,
  styles:          [],
  providers:       [
    DesignLayoutComponentStore,
  ],
  templateUrl:     './design-layout.component.html',
})
export class DesignLayoutComponent
  implements OnInit {
  private readonly _store = inject(DesignLayoutComponentStore)
  public vm$: Observable<DesignLayoutViewModel> = this._store.vm$

  ngOnInit() {
    console.log(this.constructor.name, 'ngOnInit')
  }

  trackByEntityId(index: any, panel: {
    id: string
  }) {
    return panel.id
  }
}
