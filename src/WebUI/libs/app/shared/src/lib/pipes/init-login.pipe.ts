import { inject, Pipe, PipeTransform } from '@angular/core'
import { AuthStoreService } from '@auth/data-access'
import { AppUserModel } from '@shared/data-access/models'

export interface InitLoginPipeReq {
	isAuthenticated: boolean | null
	user?: AppUserModel | null
}

@Pipe({
	name: 'initLogin',
	standalone: true,
})
export class InitLoginPipe implements PipeTransform {
	private authStore = inject(AuthStoreService)

	transform(req: InitLoginPipeReq | undefined | null) {
		if (!req) return
		if (req.user) return
		if (!req.isAuthenticated) return
		this.authStore.dispatch.login()
		return true
	}
}
