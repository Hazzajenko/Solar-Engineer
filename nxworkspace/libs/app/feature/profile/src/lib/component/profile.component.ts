import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { AuthService } from '@auth/data-access/api'
import { AuthFacade, AuthStoreService } from '@auth/data-access/facades'
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
    'username': new FormControl('', Validators.compose([
      Validators.required,

    ])),
    'password': new FormControl('', Validators.compose([
      Validators.minLength(5),
      // Validators.pattern('(?=.*[A-Z])'),
      // Validators.pattern('(?=.*\\d)'),
      Validators.required,
    ])),
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
  usernameErrors$ = this.authStore.select.errors$.pipe(map(
    errors => errors?.filter(error => error.property === 'Username'),
  ))
  passwordErrors$ = this.authStore.select.errors$.pipe(map(
    errors => errors?.filter(error => error.property === 'Password'),
  ))

  user$ = this.authStore.select.user$
  user = this.authStore.select.user
  form = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })

  validationMessages = {
    'username': [
      { type: 'required', message: 'Username is required.' },

    ],
    'password': [
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
    const username = this.loginForm.get('username')?.value
    const password = this.loginForm.get('password')?.value
    // console.log(username, password)
    if (!username) return console.error('!this.name.value')
    if (!password) return console.error('!this.password.value')
    // this.authFacade.register({ username, password })
    if (this.login) {
      // await this.authService.login({ username, password })
      this.authStore.dispatch.init({ username, password })
    } else {
      // await this.authService.register({ username, password })
      this.authStore.dispatch.register({ username, password })
    }

  }

  toggleLogin() {
    this.login = !this.login
  }

  toggleEdit() {
    this.profileEdit = !this.profileEdit
  }
}
