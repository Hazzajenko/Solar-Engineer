import { Component, inject } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { BaseService } from '@shared/logger'
import { GenerateHomeAnnouncementData, newReleasePostArray$ } from '@shared/data-access/models'
import { TimeDifferenceFromNowPipe, TruncatePipe } from '@shared/pipes'
import { Router } from '@angular/router'
import { LineBreaksToHtmlPipe } from '@shared/utils'

@Component({
  selector: 'app-home-announcements',
  templateUrl: 'home-announcements.component.html',
  imports: [CommonModule, TimeDifferenceFromNowPipe, LineBreaksToHtmlPipe, TruncatePipe],
  providers: [DatePipe],
  styles: [],
  standalone: true,
})
export class HomeAnnouncementsComponent extends BaseService {
  private router = inject(Router)
  announcements = GenerateHomeAnnouncementData(4)
  announcements$ = newReleasePostArray$

  // announcements$ = of([] as BlogPostModel[]).pipe(startWith([newReleasePost()]))

  routeToAnnouncement(name: string) {
    const noSpaceName = name.replace(/\s/g, '-')
    this.router.navigate(['blog', noSpaceName]).catch((err) => {
      this.logError('routeToAnnouncement', err)
    })
  }
}
