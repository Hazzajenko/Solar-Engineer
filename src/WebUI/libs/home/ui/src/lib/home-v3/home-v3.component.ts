import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { BaseService } from '@shared/logger'
import { HomeHeaderComponent } from '../home-header/home-header.component'
import { HOME_PAGE, HomePage } from '../home-v2/home-pages'
import {
  PinnedProjectsCardsComponent,
  ProjectsCardsComponent,
  ProjectsHomePageComponent,
  RecentProjectsCardsComponent,
} from '@projects/feature'
import { StatisticsComponent } from '@shared/ui/statistics'
import { ProjectsStoreService } from '@projects/data-access'
import { LetModule } from '@ngrx/component'
import { HomeFeedComponent } from '../home-feed/home-feed.component'
import { HomeAnnouncementsComponent } from '../home-announcements/home-announcements.component'

// import { PinnedProjectsCardsComponent } from '../../../../../projects/feature/src/lib/projects-cards/pinned-projects-cards/pinned-projects-cards.component'

@Component({
  selector: 'app-home-v3',
  standalone: true,
  imports: [
    CommonModule,
    HomeHeaderComponent,
    ProjectsHomePageComponent,
    ProjectsCardsComponent,
    StatisticsComponent,
    LetModule,
    PinnedProjectsCardsComponent,
    RecentProjectsCardsComponent,
    HomeFeedComponent,
    HomeAnnouncementsComponent,
  ],
  templateUrl: './home-v3.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeV3Component extends BaseService {
  private projectsStore = inject(ProjectsStoreService)
  projects$ = this.projectsStore.select.allProjects$
  currentPage: HomePage = HOME_PAGE.PROJECTS
}
