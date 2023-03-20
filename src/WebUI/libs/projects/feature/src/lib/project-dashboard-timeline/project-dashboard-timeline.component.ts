import { CommonModule, DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { BaseService } from '@shared/logger'
import { GenerateHomeFeedData } from '@shared/data-access/models'
import { map, of } from 'rxjs'
import { TimeDifferenceFromNowPipe } from '@shared/pipes'
import { ButtonBuilderComponent } from '@shared/ui'

@Component({
  selector: 'app-project-dashboard-timeline',
  standalone: true,
  imports: [CommonModule, TimeDifferenceFromNowPipe, ButtonBuilderComponent],
  templateUrl: './project-dashboard-timeline.component.html',
  styles: [],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDashboardTimelineComponent extends BaseService {

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
