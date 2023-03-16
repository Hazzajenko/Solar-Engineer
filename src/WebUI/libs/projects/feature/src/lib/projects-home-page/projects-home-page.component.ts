import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { BaseService } from '@shared/logger'
import { ProjectsStoreService } from '@projects/data-access'
import { MatMenuModule } from '@angular/material/menu'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { ProjectModel } from '@shared/data-access/models'
import { firstValueFrom, map, Observable, of, startWith, switchMap } from 'rxjs'
import { throwExpression } from '@shared/utils'
import { RandomNumberPipe } from '../../../../../shared/pipes/src/lib/numbers'
import { MatIconModule } from '@angular/material/icon'
import { Router } from '@angular/router'

@Component({
  selector: 'app-projects-home-page',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    RandomNumberPipe,
    MatIconModule,
  ],
  templateUrl: './projects-home-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsHomePageComponent extends BaseService implements OnInit {
  private projectsStore = inject(ProjectsStoreService)
  private router = inject(Router)
  autoCompleteControl = new FormControl('')
  projects$ = this.projectsStore.select.allProjects$
  filteredProjects$?: Observable<ProjectModel[] | undefined>
  selectedProject?: ProjectModel
  isHovered = new Map<string, boolean>()
  loading = false

  autoCompleteDisplayFunc(project: ProjectModel): string {
    return project.name ?? throwExpression('project.name is undefined')
    // return project && project.name ? project.name : ''
  }

  ngOnInit(): void {
    this.filteredProjects$ = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      switchMap((value) => {
        if (typeof value === 'string') return this.filterProjects(value)
        return of(undefined)
        // this.filterProjects(value || '')
      }),
    )
  }

  selectProject(project: ProjectModel): void {
    if (this.selectedProject?.id === project?.id) {
      this.selectedProject = undefined
      return
    }
    this.selectedProject = project
  }

  private filterProjects(query: string): Observable<ProjectModel[] | undefined> {
    if (!query) return this.projects$
    // if (query instanceof )
    // check if query is a string
    // StringSchema(query)
    // StringTextSchema.parse(query)
    // zod
    // z.string().parse(query)
    // if (typeof query !== 'string') return this.projects$
    const filterValue = query.toLowerCase()

    return this.projects$.pipe(
      map((data) => data.filter((search) => search.name.toLowerCase().includes(filterValue))),
    )
  }

  async routeToProject(project: ProjectModel) {
    this.loading = true
    // this.user
    // const user = firstValueFrom(this.currentUser$)
    const userName = await firstValueFrom(this.userName$)
    // const userName = await this.user().
    // await this.authStore.select.isLoggedIn()

    await this.router.navigate([`${userName.toLowerCase()}/${project.name}`]).then(() => {
      this.projectsStore.dispatch.initSelectProject(project.id)
      this.loading = false
    })
  }

  createRange(number: number) {
    // return new Array(number);
    return new Array(number).fill(0).map((n, index) => index + 1)
  }
}
