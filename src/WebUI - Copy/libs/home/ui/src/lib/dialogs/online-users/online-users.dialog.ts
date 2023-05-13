/* eslint-disable @angular-eslint/component-class-suffix */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'

import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'

import { MatIconModule } from '@angular/material/icon'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AuthStoreService } from '@auth/data-access'
import { ConnectionsStoreService } from '@app/data-access/connections'

import { AuthUserModel, ConnectionModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-online-users-dialog',
  templateUrl: './online-users.dialog.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButtonModule,
    AsyncPipe,
    NgForOf,
    NgStyle,
    MatListModule,
    ScrollingModule,
    NgIf,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    ShowHideComponent,
    NgClass,
    MatCardModule,
  ],
  standalone: true,
})
export class OnlineUsersDialog {
  private connectionsStore = inject(ConnectionsStoreService)
  private authStore = inject(AuthStoreService)

  onlineUsers$: Observable<ConnectionModel[]> = this.connectionsStore.select.connections$
  user$: Observable<AuthUserModel | undefined> = this.authStore.select.user$
}
