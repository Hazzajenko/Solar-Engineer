import { Route } from '@angular/router'
import { loggedInGuard, loggedInV2Guard, notLoggedInGuard } from '@auth/guards'
import { LocalProjectResolver } from '@grid-layout/data-access'
import { homeProviders } from '../home/providers'
import { projectsProviders } from '../projects/projects.providers'

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('@projects/feature').then((m) => m.ProjectsHomePageComponent),
    // loadComponent: () => import('@home/ui').then((m) => m.HomeV2Component),
    // loadComponent: () => import('@home/ui').then((m) => m.HomeComponent),
    canActivate: [loggedInV2Guard],
    // canActivate: [loggedInGuard],
    pathMatch: 'full',
    // redirectTo: 'projects',
    providers: [homeProviders],
  },
  /*  {
      path: '',
      loadComponent: () => import('@projects/feature').then((m) => m.ProjectsHomePageComponent),
      // loadComponent: () => import('@home/ui').then((m) => m.HomeV2Component),
      // loadComponent: () => import('@home/ui').then((m) => m.HomeComponent),
      canActivate: [loggedInV2Guard],
      // canActivate: [loggedInGuard],
      pathMatch: 'full',
      redirectTo: 'projects',
      providers: [homeProviders],
    },*/
  /*  {
      path: '',
      loadComponent: () => import('@home/ui').then((m) => m.HomeV3Component),
      // loadComponent: () => import('@home/ui').then((m) => m.HomeV2Component),
      // loadComponent: () => import('@home/ui').then((m) => m.HomeComponent),
      canActivate: [loggedInV2Guard],
      // canActivate: [loggedInGuard],
      pathMatch: 'full',
      providers: [homeProviders],
    },*/
  {
    path: 'sign-in',
    loadComponent: () => import('@auth/feature').then((m) => m.SignInComponent),
    canActivate: [notLoggedInGuard],
    // loadComponent: () => import('@home/ui').then((m) => m.HomeComponent),
    // canActivate: [loggedInV2Guard],
    // canActivate: [loggedInGuard],
    // providers: [homeProviders],
  },
  /*  {
      path: 'signin-google',
      loadComponent: () => import('@auth/feature').then((m) => m.GoogleSignInComponent),
    },*/
  /*  {
      path: 'login/google',
      loadComponent: () => import('@auth/feature').then((m) => m.GoogleSignInComponent),
      resolve: { googleSignIn: GoogleSignInResolver },
      // loadComponent: () => import('@home/ui').then((m) => m.HomeComponent),
      // canActivate: [loggedInV2Guard],
      // canActivate: [loggedInGuard],
      // providers: [homeProviders],
    },*/
  /*  {
      path: 'sign-in',
      loadComponent: () => import('@home/ui').then((m) => m.HomeAnonymousComponent),
      // loadComponent: () => import('@home/ui').then((m) => m.HomeComponent),
      // canActivate: [loggedInV2Guard],
      // canActivate: [loggedInGuard],
      providers: [homeProviders],
    },*/
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
    path: 'user-settings',
    loadComponent: () => import('@app/feature/user-settings').then((m) => m.UserSettingsComponent),
  },
  {
    path: 'center-feature',
    loadComponent: () => import('@app/feature/app-features').then((m) => m.CenterFeatureComponent),
  },
  {
    path: 'header',
    loadComponent: () => import('@shared/ui/header').then((m) => m.HeaderComponent),
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
        import('@app/feature/userName-profile').then((m) => m.UsersOverlayComponent),
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
    path: 'projects/dashboard',
    loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardComponent),
  },
  {
    path: 'projects/new',
    loadComponent: () => import('@projects/feature').then((m) => m.NewProjectHomeComponent),
  },
  {
    path: 'projects/search',
    loadComponent: () => import('@projects/feature').then((m) => m.ProjectsCommandPaletteComponent),
  },
  {
    path: 'projects/add-members',
    loadComponent: () => import('@projects/feature').then((m) => m.AddProjectMembersComponent),
  },
  {
    path: 'projects/add-item',
    loadComponent: () => import('@projects/feature').then((m) => m.AddProjectItemComponent),
  },
  {
    path: 'projects/settings',
    loadComponent: () => import('@projects/feature').then((m) => m.ProjectsSettingsComponent),
  },
  /*  {
      path: ':userName/:projectName/dashboard',
      loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardComponent),
      canActivate: [loggedInGuard],
      providers: [projectsProviders],
      // resolve: { project: SelectProjectResolver },
    },*/
  {
    path: ':userName/:projectName',
    loadComponent: () => import('@projects/feature').then((m) => m.WebProjectComponent),
    canActivate: [loggedInGuard],
    providers: [projectsProviders],
    // resolve: { project: SelectProjectResolver },
  },
  {
    path: ':userName/:projectName/dashboard',
    loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardComponent),
    canActivate: [loggedInGuard],
    providers: [projectsProviders],
    // resolve: { project: SelectProjectResolver },
  },
  {
    path: ':userName/:projectName/grid-layout',
    loadComponent: () => import('@projects/feature').then((m) => m.WebProjectComponent),
    canActivate: [loggedInGuard],
    providers: [projectsProviders],
    // resolve: { project: SelectProjectResolver },
  },
  /*  {
      path: 'projects/:projectName',
      loadComponent: () => import('@projects/feature').then((m) => m.WebProjectComponent),
      canActivate: [loggedInGuard],
      providers: [projectsProviders],
      // resolve: { project: SelectProjectResolver },
    },*/
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
]
