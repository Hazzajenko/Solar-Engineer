import { Route } from '@angular/router'
import { loggedInGuard } from '@auth/guards'
import { LocalProjectResolver, SelectProjectResolver } from '@project-id/data-access/resolvers'
import { homeProviders } from './home/providers'
import { projectsProviders } from './projects/providers'

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('@home/ui').then((m) => m.HomeComponent),
    providers: [homeProviders],
  },
  {
    path: 'projects/local',
    loadComponent: () => import('@project-id/feature/local').then((m) => m.LocalProjectComponent),
    providers: [projectsProviders],
    resolve: { localProject: LocalProjectResolver },
  },
  /*  {
      path: 'projects/:projectId',
      loadComponent: () => import('@project-id/feature/web').then((m) => m.WebProjectComponent),
      canActivate: [loggedInGuard],
      providers: [projectsProviders],
      resolve: { project: SelectProjectResolver },
    },*/
  {
    path: ':username/:projectName',
    loadComponent: () => import('@project-id/feature/web').then((m) => m.WebProjectV2Component),
    canActivate: [loggedInGuard],
    providers: [projectsProviders],
    resolve: { project: SelectProjectResolver },
  },
]
