import { AsyncPipe, NgIf } from '@angular/common'
import { Component, EventEmitter, inject, Output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { Router } from '@angular/router'
import { ChatroomsComponent } from '@app/feature/chatrooms'
import { AuthStoreService } from '@auth/data-access'
import { LetDirective } from '@ngrx/component'
import { AppUserProfileComponent } from '@app/feature/app-user-profile'
import {
  DialogRouteType,
  MainDialogComponent,
} from '../../../../../app/feature/main-dialog/src/lib'
import { MatCardModule } from '@angular/material/card'
import { MatListModule } from '@angular/material/list'
import { UiStoreService } from '@grid-layout/data-access'

@Component({
  selector: 'app-app-bar',
  templateUrl: 'app-bar.component.html',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    LetDirective,
    NgIf,
    MatCardModule,
    MatListModule,
  ],
  styles: [],
})
export class AppBarComponent {
  private authStore = inject(AuthStoreService)
  user$ = this.authStore.select.user$
  private dialog = inject(MatDialog)
  private router = inject(Router)
  private uiStore = inject(UiStoreService)
  /*  menu = false

    @Input() set menuState(state: boolean) {
      this.menu = state
    }*/

  @Output() toggle = new EventEmitter<boolean>()

  toggleMenu() {
    // if (!this.menuState) return
    // this.uiStore.dispatch.toggleNavMenu()
    this.toggle.emit(true)
  }

  openProfile() {
    const route: DialogRouteType = AppUserProfileComponent
    const data = {
      route,
    }

    const dialogConfig = {
      autoFocus: true,
      height: '800px',
      width: '1200px',
      data,
    } as MatDialogConfig

    this.dialog.open(MainDialogComponent, dialogConfig)
    // this.dialog.open(UserSettingsComponent, dialogConfig)
    // this.dialog.open(ProfileDialog, dialogConfig)
  }

  openChatrooms() {
    const dialogConfig = {
      autoFocus: true,
      height: '800px',
      width: '1200px',
    } as MatDialogConfig

    this.dialog.open(ChatroomsComponent, dialogConfig)
  }

  async routeHome() {
    await this.router.navigateByUrl('')
  }
}
