import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { NgIf, NgOptimizedImage } from '@angular/common'
import { WebUserModel } from '@auth/shared'

@Component({
	selector: 'auth-web-user-avatar',
	standalone: true,
	imports: [NgIf, NgOptimizedImage],
	templateUrl: './auth-web-user-avatar.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthWebUserAvatarComponent {
	@Input({ required: true }) user!: WebUserModel
	@Input() avatarSize = 24
}
