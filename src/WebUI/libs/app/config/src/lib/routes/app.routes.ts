import { homeProviders } from '../home/providers'
import { projectsProviders } from '../projects/projects.providers'
import { Route } from '@angular/router'
import { emptyRouteAuthGuard, notLoggedInGuard } from '@auth/guards'
import { SimpleNotFoundComponent } from '@shared/ui/not-found'


export const appRoutes: Route[] = [
  /*  {
   path: '',
   loadComponent: () => import('@home/feature').then((m) => m.HomeComponent),
   canActivate: [emptyRouteAuthGuard],
   pathMatch: 'full',
   providers: [homeProviders],
   },*/
  {
    path: '',
    loadComponent: () =>
      import('@design-app/feature-design-canvas').then((m) => m.DesignCanvasComponent),
    // providers: [noGridLayoutProviders],
  },
  {
    path: 'design',
    loadComponent: () =>
      import('@design-app/feature-design-layout').then((m) => m.DesignLayoutComponent),
    // providers: [noGridLayoutProviders],
  },
  {
    path: 'grid',
    loadComponent: () => import('@grid-layout/feature').then((m) => m.GridLayoutComponent),
    data: { tab: 'projects', state: 'projects' },
    providers: [projectsProviders],
  },
  {
    path: 'free',
    loadComponent: () =>
      import('@design-app/feature-design-layout').then((m) => m.DesignLayoutComponent),
  },
  {
    path: 'projects',
    loadComponent: () => import('@projects/feature').then((m) => m.ProjectsHomePageComponent),
    canActivate: [emptyRouteAuthGuard],
    /*    children: [
     {
     path: ':userName/:projectName',
     loadComponent: () => import('@projects/feature').then((m) => m.ProjectMembersDialogComponent),
     // data: { tab: 'projects', state: 'projects' },
     // loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardTimelineComponent),
     // canActivate: [loggedInGuard],
     providers: [projectsProviders],
     // resolve: { project: SelectProjectResolver },
     },
     ],*/
  },

  {
    path: 'social',
    loadComponent: () => import('@home/feature').then((m) => m.HomeComponent),
  },
  {
    path: 'blog/:blogPostName',
    loadComponent: () => import('@blog/feature').then((m) => m.BlogPostComponent),
    providers: [homeProviders],
  },
  {
    path: 'sign-in',
    loadComponent: () => import('@auth/feature').then((m) => m.SignInCenterComponent),
    canActivate: [notLoggedInGuard],
  },
  {
    path: ':userName/:projectName',
    loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardComponent),
    data: { tab: 'projects', state: 'projects' },
    // loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardTimelineComponent),
    // canActivate: [loggedInGuard],
    providers: [projectsProviders],
    // resolve: { project: SelectProjectResolver },
  },
  {
    path: ':userName/:projectName/grid',
    loadComponent: () => import('@projects/feature').then((m) => m.WebProjectComponent),
    data: { tab: 'projects', state: 'projects' },
    // loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardTimelineComponent),
    // canActivate: [loggedInGuard],
    providers: [projectsProviders],
    // resolve: { project: SelectProjectResolver },
  },
  {
    path: ':userName/:projectName/invite',
    data: { tab: 'projects', state: 'projects' },
    providers: [projectsProviders],
    loadComponent: () => import('@projects/feature').then((m) => m.AddProjectMembersComponent),
  },
  /*  {
   path: '',
   redirectTo: '',
   pathMatch: 'full',
   },*/
  {
    path: '**',
    title: '404',
    component: SimpleNotFoundComponent,
  },

  /*  {
   path: ':userName/:projectName',
   loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardComponent),
   data: { tab: 'projects', state: 'projects' },
   // loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardTimelineComponent),
   // canActivate: [loggedInGuard],
   providers: [projectsProviders],
   // resolve: { project: SelectProjectResolver },
   },
   {
   path: ':userName/:projectName/grid',
   loadComponent: () => import('@projects/feature').then((m) => m.WebProjectComponent),
   data: { tab: 'projects', state: 'projects' },
   // loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardTimelineComponent),
   // canActivate: [loggedInGuard],
   providers: [projectsProviders],
   // resolve: { project: SelectProjectResolver },
   },
   {
   path: ':userName/:projectName/invite',
   data: { tab: 'projects', state: 'projects' },
   providers: [projectsProviders],
   loadComponent: () => import('@projects/feature').then((m) => m.AddProjectMembersComponent),
   },
   {
   path: ':userName/:projectName/item',
   loadComponent: () => import('@projects/feature').then((m) => m.AddProjectItemComponent),
   },
   {
   path: ':userName/:projectName/cmd',
   loadComponent: () => import('@projects/feature').then((m) => m.ProjectsCommandPaletteComponent),
   },*/
  // ProjectsCommandPaletteComponent
  /* {
   path: 'projects/:userName/:projectName',
   loadComponent: () => import('@projects/feature').then((m) => m.ProjectMembersDialogComponent),
   data: { tab: 'projects', state: 'projects' },
   // loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardTimelineComponent),
   // canActivate: [loggedInGuard],
   providers: [projectsProviders],
   // resolve: { project: SelectProjectResolver },
   },*/
  /*  {
   path: 'social',
   loadComponent: () => import('@home/feature').then((m) => m.HomeComponent),
   },
   {
   path: 'blog/:blogPostName',
   loadComponent: () => import('@blog/feature').then((m) => m.BlogPostComponent),
   providers: [homeProviders],
   },
   {
   path: 'sign-in',
   loadComponent: () => import('@auth/feature').then((m) => m.SignInCenterComponent),
   // loadComponent: () => import('@auth/feature').then((m) => m.SignInComponent),
   canActivate: [notLoggedInGuard],
   },*/

  /*  {
   path: ':userName/:projectName',
   loadComponent: () => import('@home/feature').then((m) => m.HomeComponent),
   data: { tab: 'projects', state: 'projects' },
   // loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardTimelineComponent),
   // canActivate: [loggedInGuard],
   providers: [projectsProviders],
   // resolve: { project: SelectProjectResolver },
   },*/

  /*{
   path: 'projects',
   loadComponent: () => import('@projects/feature').then((m) => m.ProjectsHomePageComponent),
   canActivate: [loggedInGuard],
   providers: [projectsProviders],
   children: [
   {
   path: ':projectName',
   loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardTimelineComponent),
   },
   /!*      {
   path: 'dashboard',
   loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardTimelineComponent),
   },
   {
   path: 'new',
   loadComponent: () => import('@projects/feature').then((m) => m.NewProjectHomeComponent),
   },
   {
   path: 'search',
   loadComponent: () =>
   import('@projects/feature').then((m) => m.ProjectsCommandPaletteComponent),
   },
   {
   path: 'add-members',
   loadComponent: () => import('@projects/feature').then((m) => m.AddProjectMembersComponent),
   },
   {
   path: 'add-item',
   loadComponent: () => import('@projects/feature').then((m) => m.AddProjectItemComponent),
   },
   {
   path: 'settings',
   loadComponent: () => import('@projects/feature').then((m) => m.ProjectsSettingsComponent),
   },*!/
   ],
   // resolve: { project: SelectProjectResolver },
   },*/

  /* {
   path: ':userName',
   // component: ProjectsHomePageComponent,
   loadComponent: () => import('@home/ui').then((m) => m.HomeV3Component),
   // loadComponent: () => import('@projects/feature').then((m) => m.ProjectsHomePageComponent),
   // loadComponent: () => import('@home/ui').then((m) => m.HomeV2Component),
   // loadComponent: () => import('@home/ui').then((m) => m.BlogPostComponent),
   canActivate: [userAuthGuard],
   // canActivate: [userAuthGuard],
   // canActivate: [loggedInGuard],
   // pathMatch: 'full',
   // redirectTo: 'projects',
   providers: [homeProviders],
   },*/
  /*  {
   path: '',
   loadComponent: () => import('@projects/feature').then((m) => m.ProjectsHomePageComponent),
   // loadComponent: () => import('@home/ui').then((m) => m.HomeV2Component),
   // loadComponent: () => import('@home/ui').then((m) => m.BlogPostComponent),
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
   // loadComponent: () => import('@home/ui').then((m) => m.BlogPostComponent),
   canActivate: [loggedInV2Guard],
   // canActivate: [loggedInGuard],
   pathMatch: 'full',
   providers: [homeProviders],
   },*/

  /*  {
   path: 'signin-google',
   loadComponent: () => import('@auth/feature').then((m) => m.GoogleSignInComponent),
   },*/
  /*  {
   path: 'login/google',
   loadComponent: () => import('@auth/feature').then((m) => m.GoogleSignInComponent),
   resolve: { googleSignIn: GoogleSignInResolver },
   // loadComponent: () => import('@home/ui').then((m) => m.BlogPostComponent),
   // canActivate: [loggedInV2Guard],
   // canActivate: [loggedInGuard],
   // providers: [homeProviders],
   },*/
  /*  {
   path: 'sign-in',
   loadComponent: () => import('@home/ui').then((m) => m.HomeAnonymousComponent),
   // loadComponent: () => import('@home/ui').then((m) => m.BlogPostComponent),
   // canActivate: [loggedInV2Guard],
   // canActivate: [loggedInGuard],
   providers: [homeProviders],
   },*/
  /*  {
   path: 'messages',
   loadComponent: () => import('@app/feature/chatrooms').then((m) => m.ChatroomsComponent),
   canActivate: [loggedInGuard],
   // resolve: { windowSize: ChatroomResolver },
   // ChatroomResolver
   /!*    providers: [projectsProviders],
   resolve: { localProject: LocalProjectResolver },*!/
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
   },*/
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

  /*  {
   path: 'projects/dashboard',
   loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardTimelineComponent),
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
   },*/
  /*  {
   path: ':userName/:projectName/dashboard',
   loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardTimelineComponent),
   canActivate: [loggedInGuard],
   providers: [projectsProviders],
   // resolve: { project: SelectProjectResolver },
   },*/
  /* {
   path: ':userName/projects',
   loadComponent: () => import('@projects/feature').then((m) => m.ProjectsHomePageComponent),
   canActivate: [loggedInGuard],
   providers: [projectsProviders],
   // resolve: { project: SelectProjectResolver },
   },
   {
   path: ':userName/:projectName',
   loadComponent: () => import('@projects/feature').then((m) => m.WebProjectComponent),
   canActivate: [loggedInGuard],
   providers: [projectsProviders],
   // resolve: { project: SelectProjectResolver },
   },
   {
   path: ':userName/:projectName/dashboard',
   loadComponent: () => import('@projects/feature').then((m) => m.ProjectDashboardTimelineComponent),
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
   {
   path: ':userName/social',
   loadComponent: () => import('@projects/feature').then((m) => m.ProjectsHomePageComponent),
   canActivate: [loggedInGuard],
   providers: [projectsProviders],
   // resolve: { project: SelectProjectResolver },
   },*/
  /*  {
   path: 'projects/:projectName',
   loadComponent: () => import('@projects/feature').then((m) => m.WebProjectComponent),
   canActivate: [loggedInGuard],
   providers: [projectsProviders],
   // resolve: { project: SelectProjectResolver },
   },*/
  /*  {
   path: '',
   redirectTo: '',
   pathMatch: 'full',
   },
   // { path: '**', component: BgNotFoundComponent },
   {
   path: '**',
   title: '404',
   component: SimpleNotFoundComponent,
   },*/
  // { path: '**', component: SplitImageNotFoundComponent },
]