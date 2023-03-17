import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { BaseService } from '@shared/logger'
import { HomeHeaderComponent } from '../home-header/home-header.component'
import { HOME_PAGE, HomePage } from '../home-v2/home-pages'
import { ProjectsHomePageComponent } from '@projects/feature'

@Component({
  selector: 'app-home-v3',
  standalone: true,
  imports: [CommonModule, HomeHeaderComponent, ProjectsHomePageComponent],
  templateUrl: './home-v3.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeV3Component extends BaseService {
  currentPage: HomePage = HOME_PAGE.PROJECTS
}
