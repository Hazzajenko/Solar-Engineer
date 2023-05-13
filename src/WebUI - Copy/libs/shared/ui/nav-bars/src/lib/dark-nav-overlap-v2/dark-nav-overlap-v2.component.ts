import { Component, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LogoComponent, LogoNameComponent } from '@shared/ui/logo'
import { ProjectsCardsComponent } from '@projects/feature'
import { BaseService } from '@shared/logger'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'

@Component({
  selector: 'app-dark-nav-overlap-v2',
  templateUrl: 'dark-nav-overlap-v2.component.html',
  styles: [],
  imports: [CommonModule, LogoComponent, LogoNameComponent, ProjectsCardsComponent, MatMenuModule],
  standalone: true,
})
export class DarkNavOverlapV2Component extends BaseService {
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger

  openUserMenu(event: MouseEvent) {
    event.preventDefault()
    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.openMenu()
  }
}
