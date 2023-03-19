import { ComponentRef, Directive, Input, OnDestroy, ViewContainerRef } from '@angular/core'
import { HomeV3Component } from '@home/ui'
import { ProjectDashboardComponent, ProjectsHomePageComponent } from '@projects/feature'

@Directive({
  selector: '[appHomeComponent]',
  standalone: true,
})
export class HomeComponentDirective implements OnDestroy {

  constructor(public viewContainerRef: ViewContainerRef) {
  }

  homeComponentRef?: ComponentRef<HomeV3Component>
  projectsHomeComponentRef?: ComponentRef<ProjectsHomePageComponent>
  projectDashboardComponentRef?: ComponentRef<ProjectDashboardComponent>

  @Input() set state(state: string | null | undefined) {
    if (!state) return
    if (state !== 'projects') return
    const _viewContainerRef = this.viewContainerRef

    _viewContainerRef.clear()
    this.projectDashboardComponentRef = _viewContainerRef.createComponent<ProjectDashboardComponent>(ProjectDashboardComponent)
    /*   switch (state) {
     case 'home':
     this.homeComponentRef = _viewContainerRef.createComponent<HomeV3Component>(HomeV3Component)
     break
     case 'projects':
     this.projectsHomeComponentRef = _viewContainerRef.createComponent<ProjectsHomePageComponent>(ProjectsHomePageComponent)
     break
     default:
     this.homeComponentRef = _viewContainerRef.createComponent<HomeV3Component>(HomeV3Component)
     break
     }*/
  }

  @Input() set tab(tab: string | null | undefined) {

    const _viewContainerRef = this.viewContainerRef

    _viewContainerRef.clear()
    switch (tab) {
      case 'home':
        this.homeComponentRef = _viewContainerRef.createComponent<HomeV3Component>(HomeV3Component)
        break
      case 'projects':
        this.projectsHomeComponentRef = _viewContainerRef.createComponent<ProjectsHomePageComponent>(ProjectsHomePageComponent)
        break
      default:
        this.homeComponentRef = _viewContainerRef.createComponent<HomeV3Component>(HomeV3Component)
        break
    }
  }

  ngOnDestroy(): void {
    this.homeComponentRef?.destroy()
    this.projectsHomeComponentRef?.destroy()
  }
}
