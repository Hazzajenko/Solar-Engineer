import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LogoComponent, LogoNameComponent } from '@shared/ui/logo'
import { ProjectsCardsComponent } from '@projects/feature'
import { BaseService } from '@shared/logger'

@Component({
  selector: 'app-dark-nav-overlap',
  templateUrl: 'dark-nav-overlap.component.html',
  styles: [],
  imports: [CommonModule, LogoComponent, LogoNameComponent, ProjectsCardsComponent],
  standalone: true,
})
export class DarkNavOverlapComponent extends BaseService {
  style = 1
}
