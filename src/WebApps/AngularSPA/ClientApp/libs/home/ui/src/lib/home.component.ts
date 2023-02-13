import { AnimationEvent } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
  RouterLink,
} from '@angular/router'
import { AuthStoreService } from '@auth/data-access'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import * as signalR from '@microsoft/signalr'
import { LetModule } from '@ngrx/component'
import { ProjectsFacade } from '@projects/data-access/facades'
import { ProjectsListComponent } from '@projects/feature/projects-list'
import { UserModel } from '@shared/data-access/models'
import { LogoNameBackgroundV2Component } from '@shared/ui/logo'
import { AuthDialog } from 'libs/home/ui/src/lib/dialogs/auth/auth.dialog'
import { CreateProjectDialog } from 'libs/home/ui/src/lib/dialogs/create-project/create-project.dialog'
import { ConnectionsService, ConnectionsStoreService } from '@shared/data-access/connections'
import { OnlineUsersDialog } from 'libs/home/ui/src/lib/dialogs/online-users/online-users.dialog'

import { concatMap, map, Observable, switchMap, tap } from 'rxjs'
import { fadeIn, fadeInV2 } from './animations/animations'
import { AuthService, RedirectLoginOptions } from '@auth0/auth0-angular'
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Location } from '@angular/common'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatProgressSpinnerModule,
    ProjectsListComponent,
    LogoNameBackgroundV2Component,
    LetModule,
  ],
  templateUrl: './home.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectsFacade],
  // viewProviders: [BrowserAnimationsModule],
  animations: [fadeIn, fadeInV2],
})
export class HomeComponent implements OnInit {
  // user$: Observable<UserModel | undefined> = inject(AuthFacade).user$
  fade = false
  showProjects = false
  private dialog = inject(MatDialog)
  private router = inject(Router)
  private location = inject(Location)
  private projectsStore = inject(ProjectsFacade)
  private authStore = inject(AuthStoreService)
  private connectionsService = inject(ConnectionsService)
  private connectionsStore = inject(ConnectionsStoreService)
  private http = inject(HttpClient)
  private hubConnection: any
  // public auth = inject(AuthService)
  // public auth0 = inject(Auth0Service)

  /*  requestedScopes = 'openid profile read:current_user'
    auth0 = new auth0.WebAuth({
      clientID: AUTH_CONFIG.clientID,
      domain: AUTH_CONFIG.domain,
      responseType: 'token id_token',
      audience: AUTH_CONFIG.audience,
      redirectUri: AUTH_CONFIG.callbackURL,
      scope: this.requestedScopes,
      leeway: 30,
    })*/

  usersOnline$ = this.connectionsStore.select.connections$

  onlineUsers$ = this.connectionsService.onlineUsers$
  user$ = this.authStore.select.user$

  routerEvents$ = this.router.events
  profile: any

  ngOnInit(): void {
    /*    this.auth0.handleAuthentication()
        this.auth0.scheduleRenewal()
        if (this.auth0.userProfile) {
          this.profile = this.auth0.userProfile
        } else {
          this.auth0.getProfile((err: any, profile: any) => {
            this.profile = profile
          })
        }*/
    // console.log(parent)
    /*    if (this.auth0.isAuthenticated()) {
          const profile = this.auth0.userProfile
          let profileAny: any
          let err: any
          const dl = this.auth0.getProfile(profileAny)
          console.log(profile)
          console.log(dl)
          console.log(profileAny)
        }*/
    this.connectionsService.onlineUsers$.subscribe((res) => console.log(res))
    // this.auth.idTokenClaims$.subscribe((res) => console.log(res))
    // this.auth.getAccessTokenSilently().subscribe((res) => console.log(res))
    // this.auth.user$.subscribe((res) => console.log(res))
    // this.auth.idTokenClaims$.subscribe((res) => console.log(res))

    // this.auth.
    /*    this.http.get('https://dev-t8co2m74.us.auth0.com/userinfo').subscribe((res) => console.log(res))
        this.http
          .get(
            'https://dev-t8co2m74.us.auth0.com/authorize?' +
              'response_type=code&' +
              'client_id=uE6uqQDFUsznlWaTqa2MNj1ObKuGlmNq&' +
              'redirect_uri=http://localhost:4200&' +
              'scope=read:users&' +
              'audience=https://solarengineer.dev&' +
              'state=xyzABC123',
          )
          .subscribe((res) => console.log('authorize', res))*/
    /*    this.auth.user$
          .pipe(
            /!*        concatMap((user) =>
                      // Use HttpClient to make the call
                      this.http.get(encodeURI(`https://dev-t8co2m74.us.auth0.com/api/v2/users/${user?.sub}`)),
                    ),
                    map((user) => (user as any).user_metadata),*!/
            // tap((meta) => (this.metadata = meta))
            /!*        concatMap((user) =>
                      // Use HttpClient to make the call
                      this.http.get(encodeURI(`https://YOUR_DOMAIN/api/v2/users/${user.sub}`)),
                    ),
                    map((user) => user['user_metadata']),*!/
            tap((meta) => console.log('meta', meta)),
            switchMap((user) => this.http.get(`/api/account/profile`)),
            tap((meta) => console.log('meta', meta)),
            // tap((meta) => (this.metadata = meta)),
          )
          .subscribe()*/
    // this.http.get(`/api/account/profile`).subscribe((res) => console.log('profile', res))
    // this.http.post(`/api/auth0/login`, {}).subscribe((res) => console.log('profile', res))
    // this.auth.
    /*    Accept: 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',*/
    const headerDict = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    }
    // this.auth.
    /*    this.http
          .post(
            `https://solarengineer.dev/oauth/token`,
            {
              grant_type: 'client_credentials',
              client_id: 'uE6uqQDFUsznlWaTqa2MNj1ObKuGlmNq',
              client_secret: 'le-rnpL59fiCWhiNYKLvdI9vAkRHsUFkbnZrFi51PbndtBNAnAF9lbtSz7Q4piS-',
              audience: 'https://solarengineer.dev',
            },
            requestOptions,
          )
          .subscribe((res) => console.log('token!!', res))*/
    // this.auth
    /*    domain: 'dev-t8co2m74.us.auth0.com',
          clientId: 'uE6uqQDFUsznlWaTqa2MNj1ObKuGlmNq',*/
    /*    curl --request POST \
      --url 'https://dev-t8co2m74.us.auth0.com/oauth/token' \
      --header 'content-type: application/x-www-form-urlencoded' \
      --data grant_type=client_credentials \
      --data client_id=YOUR_CLIENT_ID \
      --data client_secret=YOUR_CLIENT_SECRET \
      --data audience=YOUR_API_IDENTIFIER*/
  }

  authLogin() {
    /*    this.auth.loginWithRedirect({
          authorizationParams: {},
        })*/
  }

  loginDevBot() {
    /*    this.authStore.dispatch.init({
          userName: 'postmantest',
          password: 'PostmanTest1',
        })*/
  }

  loginDevBot2() {
    /*    this.authStore.dispatch.init({
          userName: 'postmantest2',
          password: 'PostmanTest1',
        })*/
  }

  async authenticate(login: boolean) {
    // const dialogConfig = new MatDialogConfig()
    const dialogConfig = {
      disableClose: true,
      autoFocus: true,
      data: {
        login,
      },
      height: '400px',
      width: '300px',
    } as MatDialogConfig
    /*
        dialogConfig.disableClose = true
        dialogConfig.autoFocus = true

        dialogConfig.data = {
          login,
        }

        dialogConfig.height = {
          login,
        }

        height: '400px',
          width: '600px',*/
    /*
        this.dialog.open(AuthDialog, dialogConfig)

        const user = await this.authStore.select.user
        if (user) {
          this.dialog.closeAll()
        }*/

    /*    // const dialog = this.dialog.open(ProfileComponent)
        const result = await firstValueFrom(dialog.afterClosed())
        // if (result instanceof StringModel) {
        //   this.snack(`Created and selected new string ${result.name}`)
        // }*/
  }

  routeToProjects() {
    // this.router.navigate(['projects']).then(() => this.projectsStore.init())
    this.showProjects = !this.showProjects
  }

  routeToLocalProject() {
    this.router.navigate(['projects/local']).then((res) => console.log(res))
    // this.showProjects = !this.showProjects
  }

  fadeInOut() {
    this.fade = !this.fade
  }

  fadeStart(event: AnimationEvent) {
    console.log(event)
  }

  fadeDone(event: AnimationEvent) {
    console.log(event)
  }

  routeToWebProject() {
    this.dialog.open(CreateProjectDialog)
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

  viewOnlineUsers() {
    this.dialog.open(OnlineUsersDialog)
  }

  authLogout() {
    // this.auth.logout({ logoutParams: { returnTo: document.location.origin } })
  }

  loginWithGoogle() {
/*     this.http
      .get('/auth/login/google', { withCredentials: true })
      // .pipe(catchError(() => EMPTY))
      .subscribe((res) => {
        // console.log(res)
        console.log('google', res)
        // /*      window.location.href = `${res}`*/

      this.http
      .get('/auth/login/google', { withCredentials: true })
      // .pipe(catchError(() => EMPTY))
      .subscribe((res) => {
        // console.log(res)
        console.log('google', res)
        // /*      window.location.href = `${res}`*/
      })
    this.location.go('/auth/login/google')
    window.location.reload()
    /*   this.location.go('/auth/login/google')
       window.location.reload()*/
    // this.location.onUrlChange((url, state) => this.location.forward())
    // Location.go('/auth/login/google')
    // this.router.navigateByUrl('/auth/login/google')
  }
}