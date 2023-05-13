import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { AuthStoreService } from '@auth/data-access'

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './authenticated-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  standalone: true,
})
export class AuthenticatedPageComponent implements OnInit {
  private authStore = inject(AuthStoreService)

  ngOnInit(): void {
    this.authStore.dispatch.authorizeRequest()
  }
}
