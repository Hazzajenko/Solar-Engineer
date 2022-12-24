import { Component, inject, OnInit } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { AuthFacade } from '@auth/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { AppComponentStore } from '@shared/data-access/app-component-store'

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppComponentStore, ProjectsFacade, AuthFacade],
})
export class AppComponent implements OnInit {
  title = 'design'
  private store = inject(AppComponentStore)
  private authStore = inject(AuthFacade)
  private projectsStore = inject(ProjectsFacade)
  private router = inject(Router)

  ngOnInit(): void {
    this.authStore.init({ username: 'string', password: 'Password1' })
    // this.projectsStore.init()
    // this.router.navigate(['projects']).then((res) => console.log(res))
  }
}
