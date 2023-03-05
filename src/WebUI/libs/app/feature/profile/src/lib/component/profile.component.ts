import { Inject, inject } from '@angular/core'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'

import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'

import { MatIconModule } from '@angular/material/icon'

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AuthService } from '@auth/data-access/api'
import { AuthFacade, AuthStoreService } from '@auth/data-access/services'
import { StringsService } from '@grid-layout/data-access/services'

import { ShowHideComponent } from '@shared/ui/show-hide'

import { map } from 'rxjs'

@Component({
  selector: 'app-profile-component',
  templateUrl: './profile.component.html',
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
export class ProfileComponent {
  loginForm: FormGroup = new FormGroup({
    userName: new FormControl('', Validators.compose([Validators.required])),
    password: new FormControl(
      '',
      Validators.compose([
        Validators.minLength(5),
        // Validators.pattern('(?=.*[A-Z])'),
        // Validators.pattern('(?=.*\\d)'),
        Validators.required,
      ]),
    ),
  })
  loading = false

  submitted = false
  name = new FormControl('')
  password = new FormControl('')
  private stringsFactory = inject(StringsService)
  private authService = inject(AuthService)
  private authFacade = inject(AuthFacade)
  private authStore = inject(AuthStoreService)
  private formBuilder = inject(FormBuilder)

  authError$ = this.authStore.select.error$
  authErrorMessages$ = this.authStore.select.errors$
  profileEdit = false
  userNameErrors$ = this.authStore.select.errors$.pipe(
    map((errors) => errors?.filter((error) => error.property === 'Username')),
  )
  passwordErrors$ = this.authStore.select.errors$.pipe(
    map((errors) => errors?.filter((error) => error.property === 'Password')),
  )

  user$ = this.authStore.select.user$
  user = this.authStore.select.user
  form = this.formBuilder.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  })

  validationMessages = {
    userName: [{ type: 'required', message: 'Username is required.' }],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      // { type: '(?=.*[A-Z])', message: 'Needs uppercase and numbers' },
    ],
  }
  login = true

  get f() {
    return this.form.controls
  }

  async onSubmit() {
    const userName = this.loginForm.get('userName')?.value
    const password = this.loginForm.get('password')?.value
    // console.log(userName, password)
    if (!userName) return console.error('!this.name.value')
    if (!password) return console.error('!this.password.value')
    // this.authFacade.register({ userName, password })
    if (this.login) {
      // await this.authService.login({ userName, password })
      this.authStore.dispatch.init({ userName, password })
    } else {
      // await this.authService.register({ userName, password })
      this.authStore.dispatch.register({ userName, password })
    }
  }

  toggleLogin() {
    this.login = !this.login
  }

  toggleEdit() {
    this.profileEdit = !this.profileEdit
  }
}
