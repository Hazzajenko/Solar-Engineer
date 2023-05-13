import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterFacade } from '@shared/data-access/router'
import { HomeComponentDirective } from './home-component.directive'
import { HomeFeedComponent, HomeHeaderComponent } from '@home/ui'
import { FooterComponent } from '@shared/ui/footer'
import { ActivatedRoute, Router } from '@angular/router'
import { map } from 'rxjs'
import { HomeNavService } from '@home/data-access'
import { RecentProjectsCardsComponent } from '@projects/feature'
import { HomeAnnouncementsComponent } from '../../../../ui/src/lib/home-announcements/home-announcements.component'
import { BaseService } from '@shared/logger'
import { LetModule } from '@ngrx/component'
import { ProjectsStoreService } from '@projects/data-access'
import { NgIfForComponent } from '@shared/utils'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeComponentDirective,
    HomeHeaderComponent,
    FooterComponent,
    RecentProjectsCardsComponent,
    HomeFeedComponent,
    HomeAnnouncementsComponent,
    LetModule,
    NgIfForComponent,
  ],
  templateUrl: './home.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends BaseService {
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
