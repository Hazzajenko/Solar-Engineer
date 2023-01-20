import { AsyncPipe, NgIf } from '@angular/common'
import { Component, EventEmitter, inject, Output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { ProfileDialog } from '@app/feature/profile'
import { AuthStoreService } from '@auth/data-access/facades'
import { LetModule } from '@ngrx/component'

@Component({
  selector: 'app-app-bar',
  templateUrl: 'app-bar.component.html',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    LetModule,
    NgIf,
  ],
  styles: [],
})

export class AppBarComponent {
  private authStore = inject(AuthStoreService)
  user$ = this.authStore.select.user$
  private dialog = inject(MatDialog)
  /*  menu = false

    @Input() set menuState(state: boolean) {
      this.menu = state
    }*/

  @Output() toggle = new EventEmitter<boolean>()

  toggleMenu() {
    // if (!this.menuState) return

    this.toggle.emit(true)

  }

  openProfile() {
    const dialogConfig = {
      autoFocus: true,
      height: '800px',
      width: '1000px',
    } as MatDialogConfig

    this.dialog.open(ProfileDialog, dialogConfig)
  }
}