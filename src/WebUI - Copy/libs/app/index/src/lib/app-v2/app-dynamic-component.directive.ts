import { ComponentRef, Directive, inject, Input, NgZone, OnDestroy, OnInit, ViewContainerRef } from '@angular/core'
import { HomeV3Component } from '@home/ui'
import { ProjectsHomePageComponent } from '@projects/feature'
import { RouterFacade } from '@shared/data-access/router'

@Directive({
  selector: '[appDynamicComponent]',
  standalone: true,
})
export class AppDynamicComponentDirective implements OnInit, OnDestroy {
  private routerFacade = inject(RouterFacade)

  constructor(public viewContainerRef: ViewContainerRef, private _ngZone: NgZone) {
  }

  homeComponentRef?: ComponentRef<HomeV3Component>
  projectsHomeComponentRef?: ComponentRef<ProjectsHomePageComponent>

  @Input() set tab(tab: string | null | undefined) {
    console.log('tab', tab)

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

  ngOnInit(): void {
    // throw new Error('Method not implemented.')
    /*    this.routerFacade.routeParam$('tab').subscribe((tab) => {
     console.log('tab', tab)
     switch (tab) {
     case 'home':
     this.loadHome()
     break
     case 'projects':
     this.loadProjects()
     break
     default:
     this.loadHome()
     break
     }
     })*/

  }

  loadHome() {
    const _viewContainerRef = this.viewContainerRef
    _viewContainerRef.clear()
    this.homeComponentRef = _viewContainerRef.createComponent<HomeV3Component>(HomeV3Component)

  }

  loadProjects() {
    const _viewContainerRef = this.viewContainerRef
    _viewContainerRef.clear()
    this.projectsHomeComponentRef = _viewContainerRef.createComponent<ProjectsHomePageComponent>(ProjectsHomePageComponent)
  }

  ngOnDestroy(): void {
    this.homeComponentRef?.destroy()
    this.projectsHomeComponentRef?.destroy()
  }
}
