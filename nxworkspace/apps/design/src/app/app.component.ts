import { Component, inject, OnInit } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AuthFacade } from '@auth/data-access/facades'

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
  private authStore = inject(AuthFacade)

  ngOnInit(): void {
    console.log(new Date().getDate().toString())
    // this.authStore.init({ username: 'string', password: 'Password1' })
    this.authStore.isReturningUser()
    // this.projectsStore.init()
    // this.router.navigate(['projects']).then((res) => console.log(res))
  }
}
