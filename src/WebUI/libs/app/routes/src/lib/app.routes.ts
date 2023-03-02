import { Route } from '@angular/router'
import { loggedInGuard } from '@auth/guards'
import { LocalProjectResolver, SelectProjectResolver } from '@project-id/data-access/resolvers'
// import { ChatroomResolver } from '../../../feature/chatrooms/src/lib/chatroom.resolver'
import { homeProviders } from './home/providers'
import { projectsProviders } from './projects/providers'
// import { UserNameProfileResolver } from '../../../feature/userName-profile/src/lib/user-name-profile.resolver'
// nx bu/
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
    loadComponent: () => import('@project-id/feature/local').then((m) => m.LocalProjectComponent),
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
    loadComponent: () => import('@project-id/feature/web').then((m) => m.WebProjectV2Component),
    canActivate: [loggedInGuard],
    providers: [projectsProviders],
    resolve: { project: SelectProjectResolver },
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
]
