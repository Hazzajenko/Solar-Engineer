/* eslint-disable @angular-eslint/component-class-suffix */
import { Inject, inject } from '@angular/core'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'

import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'

import { MatIconModule } from '@angular/material/icon'

import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AuthService } from '@auth/data-access/api'
import { AuthFacade, AuthStoreService } from '@auth/data-access/facades'
import { StringsService } from '@grid-layout/data-access/services'
import { ProjectsStoreService } from '@projects/data-access/facades'
import { ConnectionsStoreService } from '@shared/data-access/connections'

import { ConnectionModel, StringModel, UserModel } from '@shared/data-access/models'
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
  user$: Observable<UserModel | undefined> = this.authStore.select.user$

}