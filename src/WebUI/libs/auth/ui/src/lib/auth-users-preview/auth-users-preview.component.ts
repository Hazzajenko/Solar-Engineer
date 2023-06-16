import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { WebUserModel } from '@auth/shared'
import { AuthWebUserAvatarComponent } from '../auth-web-user-avatar/auth-web-user-avatar.component'
import { NgForOf, NgIf } from '@angular/common'

@Component({
	selector: 'auth-users-preview',
	standalone: true,
	imports: [AuthWebUserAvatarComponent, NgForOf, NgIf],
	templateUrl: './auth-users-preview.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthUsersPreviewComponent {
	private _users: WebUserModel[] = []
	recentUsers: WebUserModel[] = []

	get users(): WebUserModel[] {
		return this._users
	}

	@Input() set users(users: WebUserModel[]) {
		this.recentUsers = users.slice(0, 4)
		this._users = users
	}
}
