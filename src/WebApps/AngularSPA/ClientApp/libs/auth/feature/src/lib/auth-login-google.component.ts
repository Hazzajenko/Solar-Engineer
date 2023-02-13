import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-chatrooms-component',
  templateUrl: './auth-login-google.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  standalone: true,
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
})
export class AuthLoginGoogleComponent {}
