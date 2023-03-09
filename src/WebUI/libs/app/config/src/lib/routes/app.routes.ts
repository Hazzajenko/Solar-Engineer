import { Route } from '@angular/router'
import { loggedInGuard } from '@auth/guards'
import { LocalProjectResolver } from '@grid-layout/data-access'
import { homeProviders } from '../home/providers'
import { projectsProviders } from '../projects/projects.providers'

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('@home/ui').then((m) => m.HomeComponent),
    providers: [homeProviders],
  },
  {
    path: 'messages',
    loadComponent: () => import('@app/feature/chatrooms').then((m) => m.ChatroomsComponent),
    canActivate: [loggedInGuard],
    // resolve: { windowSize: ChatroomResolver },
    // ChatroomResolver
    /*    providers: [projectsProviders],
        resolve: { localProject: LocalProjectResolver },*/
  },
  {
    path: 'authorize',
    loadComponent: () => import('@auth/feature').then((m) => m.AuthenticatedPageComponent),
  },
  {
    path: 'projects/local',
    loadComponent: () => import('@projects/feature').then((m) => m.LocalProjectComponent),
    providers: [projectsProviders],
    resolve: { localProject: LocalProjectResolver },
  },
  /*  {
      path: 'user/:userName',
      loadComponent: () =>
        import('@app/feature/userName-profile').then((m) => m.UsernameProfileComponent),
      canActivate: [loggedInGuard],
      resolve: { userNameProfile: UserNameProfileResolver },
    },*/
  /*  {
      path: 'projects/:projectId',
      loadComponent: () => import('@project-id/feature/web').then((m) => m.WebProjectComponent),
      canActivate: [loggedInGuard],
      providers: [projectsProviders],
      resolve: { project: SelectProjectResolver },
    },*/
  /*  {
      path: ':userName/:projectName',
      loadComponent: () => import('@project-id/feature/web').then((m) => m.WebProjectV2Component),
      canActivate: [loggedInGuard],
      providers: [projectsProviders],
      resolve: { project: SelectProjectResolver },
    },*/
  {
    path: 'projects/:projectName',
    loadComponent: () => import('@projects/feature').then((m) => m.WebProjectComponent),
    canActivate: [loggedInGuard],
    providers: [projectsProviders],
    // resolve: { project: SelectProjectResolver },
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
]
