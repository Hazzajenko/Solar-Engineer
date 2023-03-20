import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterFacade } from '@shared/data-access/router'
import { HomeRouterDirective } from './home-router.directive'
import { ActivatedRoute, Router } from '@angular/router'
import { map } from 'rxjs'
import { HomeNavService } from '@home/data-access'
import { BaseService } from '@shared/logger'
import { ProjectsStoreService } from '@projects/data-access'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeRouterDirective,
  ],
  templateUrl: './home-router.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeRouterComponent extends BaseService {
  private routerFacade = inject(RouterFacade)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private homeNavService = inject(HomeNavService)
  private projectsStore = inject(ProjectsStoreService)
  projects$ = this.projectsStore.select.allProjects$
  homeNavRoute$ = this.homeNavService.route$
  tab$ = this.routerFacade.queryParam$('tab')
  routeState$ = this.route.data.pipe(map((data) => (data as { state: string }).state))

  /*  constructor() {
   // this.router.da
   this.route.data.subscribe(console.log)
   }*/
}
