import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterFacade } from '@shared/data-access/router'
import { HomeComponentDirective } from './home-component.directive'
import { HomeHeaderComponent } from '@home/ui'
import { FooterComponent } from '@shared/ui/footer'
import { ActivatedRoute, Router } from '@angular/router'
import { map } from 'rxjs'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeComponentDirective,
    HomeHeaderComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private routerFacade = inject(RouterFacade)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  tab$ = this.routerFacade.queryParam$('tab')
  routeState$ = this.route.data.pipe(map((data) => (data as { state: string }).state))

  constructor() {
    // this.router.da
    this.route.data.subscribe(console.log)
  }
}
