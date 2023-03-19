import { Component } from '@angular/core'
import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common'
import { HOME_PAGE, HomePage } from '../home-v2/home-pages'
import { MatMenuModule } from '@angular/material/menu'
import { RouteBreadcrumbsComponent } from '@shared/ui/route-breadcrumbs'
import { BaseService } from '@shared/logger'
import { LetModule } from '@ngrx/component'
import { generateProfilePicture } from '@shared/utils'
import { GenerateHomeFeedData, GenerateUserData } from '@shared/data-access/models'
import { TimeDifferenceFromNowPipe } from '@shared/pipes'
import { map, of } from 'rxjs'

@Component({
  selector: 'app-home-feed',
  templateUrl: 'home-feed.component.html',
  imports: [
    CommonModule,
    MatMenuModule,
    RouteBreadcrumbsComponent,
    LetModule,
    TimeDifferenceFromNowPipe,
    NgOptimizedImage,
  ],
  providers: [DatePipe],
  styles: [],
  standalone: true,
})
export class HomeFeedComponent extends BaseService {
  currentPage: HomePage = HOME_PAGE.PROFILE

  profilePictureUrl = generateProfilePicture('HJ')
  users = GenerateUserData(4)
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

  // @Input() user!: AuthUserModel

  changeHomePage(pageName: HomePage) {
    this.currentPage = pageName
  }
}
