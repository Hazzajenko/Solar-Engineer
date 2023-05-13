import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BaseService } from '@shared/logger'
import { ButtonBuilderComponent } from '@shared/ui'
import { Router } from '@angular/router'

@Component({
  selector: 'app-simple-not-found',
  templateUrl: 'simple-not-found.component.html',
  styles: [],
  imports: [CommonModule, ButtonBuilderComponent],
  standalone: true,
})
export class SimpleNotFoundComponent extends BaseService {
  private router = inject(Router)

  routeToHome() {
    this.logDebug('routeToHome')
    this.router.navigate(['/']).catch((e) => this.logError(e))
  }
}
