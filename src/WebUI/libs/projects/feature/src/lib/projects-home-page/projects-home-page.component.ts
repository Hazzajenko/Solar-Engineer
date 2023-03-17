import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core'
import { BaseService } from '@shared/logger'
import { ProjectsSignalrService, ProjectsStoreService } from '@projects/data-access'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { ProjectModel } from '@shared/data-access/models'
import { firstValueFrom, map, Observable, of, startWith, switchMap } from 'rxjs'
import { RandomNumberPipe } from '../../../../../shared/pipes/src/lib/numbers'
import { MatIconModule } from '@angular/material/icon'
import { Router } from '@angular/router'
import { ProjectsBreadcrumbBarComponent } from '../projects-breadcrumb-bar'
import { MatDialog } from '@angular/material/dialog'
import { CreateProjectDialogComponent } from '../create-project-dialog/create-project-dialog.component'
import { PROJECTS_SORTS, ProjectSorts } from './project-sorts'
import { LetModule } from '@ngrx/component'

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
    ProjectsBreadcrumbBarComponent,
    LetModule,
  ],
  templateUrl: './projects-home-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsHomePageComponent extends BaseService implements OnInit {
  private projectsStore = inject(ProjectsStoreService)
  private router = inject(Router)
  private matDialog = inject(MatDialog)
  private projectsSignalrService = inject(ProjectsSignalrService)

  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  // @ViewChild(MatMenuTrigger, { static: true }) projectOptionsMenu!: MatMenuTrigger
  autoCompleteControl = new FormControl('')
  projects$ = this.projectsStore.select.allProjects$
  filteredProjects$?: Observable<ProjectModel[] | undefined>
  selectedProject?: ProjectModel
  isHovered = new Map<string, boolean>()
  loading = false
  currentSort: ProjectSorts = PROJECTS_SORTS.LAST_MODIFIED

  ngOnInit(): void {
    this.initFilteredProjects()
  }

  changeProjectSort(sort: ProjectSorts) {
    this.currentSort = sort
    this.initFilteredProjects()
  }

  initFilteredProjects() {
    this.filteredProjects$ = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      switchMap((value) => {
        if (typeof value === 'string')
          return this.projects$.pipe(
            map((data) => {
              const filterSearch = value
                ? data.filter((search) => search.name.toLowerCase().includes(value.toLowerCase()))
                : data

              return (() => {
                switch (this.currentSort) {
                  case PROJECTS_SORTS.NAME:
                    return filterSearch.sort((a, b) => (a.name > b.name ? 1 : -1))

                  case PROJECTS_SORTS.CREATED:
                    return filterSearch.sort((a, b) =>
                      new Date(a.createdTime) > new Date(b.createdTime) ? -1 : 1,
                    )

                  case PROJECTS_SORTS.LAST_MODIFIED:
                    return filterSearch.sort((a, b) =>
                      new Date(a.lastModifiedTime) > new Date(b.lastModifiedTime) ? -1 : 1,
                    )
                  default:
                    return filterSearch.sort((a, b) =>
                      new Date(a.lastModifiedTime) > new Date(b.lastModifiedTime) ? -1 : 1,
                    )
                }
              })()
            }),
          )
        return of(undefined)
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

  onRightClick(event: MouseEvent, project: ProjectModel) {
    event.preventDefault()
    // this.logDebug('onRightClick', event, project)
    // this.logDebug('onRightClick', this.projectOptsionsMenu)
    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    // this.matMenuTrigger.
    // this.projectOptionsMenu.menuData = { project }
    // this.projectOptionsMenu.openMenu()
    this.matMenuTrigger.menuData = { project }
    this.matMenuTrigger.openMenu()
  }

  openCreateProjectDialog() {
    this.matDialog.open(CreateProjectDialogComponent, {
      // width: '500px',
      // height: '500px',
      // data: { name: 'test' },
    })
  }

  deleteProject(project: ProjectModel) {
    this.projectsSignalrService.deleteProject(project.id)
  }
}
