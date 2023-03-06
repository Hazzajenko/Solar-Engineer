import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { NavigationStart, Router, RouterEvent } from '@angular/router'
import { AuthStoreService } from '@auth/data-access'
import { ProjectsFacade, ProjectsStoreService } from '@projects/data-access'
import { ProjectModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatProgressSpinnerModule],
  templateUrl: './projects-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsListComponent {
  private router = inject(Router)
  private store = inject(ProjectsFacade)
  private projectsStore = inject(ProjectsStoreService)
  private authStore = inject(AuthStoreService)
  projects$: Observable<ProjectModel[] | undefined> = this.projectsStore.select.allProjects$
  routerEvents$ = this.router.events
  loading = false

  routeToProject(project: ProjectModel) {
    this.loading = true
    // this.store.initSelectProject(project.id)
    this.router.navigate([`projects/${project.id}`]).then((r) => r)
  }

  async routeToProjectV2(project: ProjectModel) {
    this.loading = true
    /*    const user = await this.authStore.select.user
        if (!user) return
        // this.store.initSelectProject(project.id)

        // this.router.navigate([`projects/${project.name}`]).then((r) => r)
        this.router.navigate([`${user.displayName}/${project.name}`]).then((r) => r)*/
  }

  async routeToProjectV3(project: ProjectModel) {
    this.loading = true
    await this.authStore.select.isLoggedIn()


    await this.router.navigate([`projects/${project.name}`]).then(() => {
        this.projectsStore.dispatch.initSelectProject(project.id)
        this.loading = false
      },
    )
  }

  instanceOfNavigationStart(routerEvents: RouterEvent | any) {
    console.log(routerEvents)
    if (routerEvents instanceof NavigationStart) {
      console.log(true)
      return true
    }
    console.log(false)
    return false
  }
}
