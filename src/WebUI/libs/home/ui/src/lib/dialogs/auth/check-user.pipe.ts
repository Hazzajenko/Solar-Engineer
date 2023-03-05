import { Inject, inject, Pipe, PipeTransform } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { AuthStoreService } from '@auth/data-access/services'
import { UserModel } from '@shared/data-access/models'
// import { AuthDialog } from 'libs/home/ui/src/lib/dialogs/auth/auth.dialog'
import { ConnectionsStoreService } from '@app/data-access/connections'
import { AuthDialog } from './auth.dialog'

@Pipe({
  name: 'checkUser',
  standalone: true,
})
export class CheckUserPipe implements PipeTransform {
  private router = inject(Router)
  private authStore = inject(AuthStoreService)
  private connectionsService = inject(ConnectionsStoreService)

  constructor(private dialogRef: MatDialogRef<AuthDialog>, @Inject(MAT_DIALOG_DATA) data: any) {}

  async transform(user: UserModel | undefined | null) {
    if (!user) return

    const token = await this.authStore.select.token
    if (!token) return
    // this.connectionsService.createHubConnection(token)
    // this.connectionsService.connectSignalR()
    return this.dialogRef.close()
    // return this.router.navigate(['projects/local']).then((res) => console.log(res))
    // this.router.navigate(['projects/local']).then((res) => console.log(res))
  }
}
