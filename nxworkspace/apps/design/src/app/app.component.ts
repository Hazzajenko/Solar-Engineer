import { Component, inject, OnInit } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AuthService } from '@auth/data-access/api'
import { AuthFacade, AuthStoreService } from '@auth/data-access/facades'

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  providers: [AuthFacade],
})
export class AppComponent implements OnInit {
  title = 'design'
  private authStore = inject(AuthStoreService)

  // private auth = inject(AuthService)
  returningUser = false

  ngOnInit(): void {
    // console.log(new Date().getDate().toString())
    if (this.returningUser) {
      this.authStore.dispatch.isReturningUser()
    }
  }
}
