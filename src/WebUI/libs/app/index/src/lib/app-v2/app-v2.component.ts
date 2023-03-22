import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { BaseService } from '@shared/logger'
import { HomeHeaderComponent } from '@home/ui'
import { RouterOutlet } from '@angular/router'
import { FooterComponent } from '@shared/ui/footer'
import { LetModule } from '@ngrx/component'
import { CoreComponentsAngularModule } from 'core-components-angular'
import { AppDynamicComponentDirective } from './app-dynamic-component.directive'
import { RouterFacade } from '@shared/data-access/router'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    HomeHeaderComponent,
    RouterOutlet,
    FooterComponent,
    LetModule,
    CoreComponentsAngularModule,
    AppDynamicComponentDirective,
  ],
  selector: 'app-root-old-v2',
  templateUrl: './app-v2.component.html',
  styles: [],
})
export class AppV2Component extends BaseService {
  private routerFacade = inject(RouterFacade)
  tab$ = this.routerFacade.queryParam$('tab')
}
