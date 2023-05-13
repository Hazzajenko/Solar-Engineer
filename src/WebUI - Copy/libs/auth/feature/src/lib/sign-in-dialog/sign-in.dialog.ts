/* eslint-disable @angular-eslint/component-class-suffix */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'

import { ScrollingModule } from '@angular/cdk/scrolling'
import {
  AsyncPipe,
  Location,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgTemplateOutlet,
} from '@angular/common'
import { MatListModule } from '@angular/material/list'

import { MatIconModule } from '@angular/material/icon'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AuthFacade, AuthService } from '@auth/data-access'
import { ShowHideComponent } from '@shared/ui/show-hide'
import { HttpClient } from '@angular/common/http'
import { AuthStoreService } from '@auth/data-access'

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './sign-in.dialog.html',
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
    NgTemplateOutlet,
  ],
  standalone: true,
})
export class SignInDialog {
  private http = inject(HttpClient)
  private location = inject(Location)
  private authService = inject(AuthService)
  private authFacade = inject(AuthFacade)
  private authStore = inject(AuthStoreService)

  loginWithGoogle() {
    this.authStore.dispatch.loginWithGoogle()
    /*    this.http
          .get('/auth/login/google', { withCredentials: true })
          // .pipe(catchError(() => EMPTY))
          .subscribe((res) => {
            // console.log(res)
            console.log('google-https', res)
            // /!*      window.location.href = `${res}`*!/
          })
        this.location.go('/auth/login/google')
        window.location.reload()*/
  }
}
