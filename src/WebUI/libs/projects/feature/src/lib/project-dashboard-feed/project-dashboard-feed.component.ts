import { Component } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { BaseService } from '@shared/logger'
import { GenerateHomeFeedData } from '@shared/data-access/models'
import { TimeDifferenceFromNowPipe } from '@shared/pipes'
import { map, of } from 'rxjs'
import { ButtonBuilderComponent } from '@shared/ui'

@Component({
  selector: 'app-project-dashboard-feed',
  templateUrl: 'project-dashboard-feed.component.html',
  imports: [
    CommonModule,
    TimeDifferenceFromNowPipe,
    ButtonBuilderComponent,
  ],
  providers: [DatePipe],
  styles: [],
  standalone: true,
})
export class ProjectDashboardFeedComponent extends BaseService {

  feeds = GenerateHomeFeedData(4)

  feeds$ = of(this.feeds).pipe(
    map((feeds) => {
      return feeds.sort((a, b) => {
        const aDate = new Date(a.eventTime).getTime()
        const bDate = new Date(b.eventTime).getTime()
        return bDate - aDate
      })
    }),
  )
}
