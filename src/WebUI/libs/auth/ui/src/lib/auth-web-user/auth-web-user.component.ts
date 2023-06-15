import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { WebUserModel } from '@auth/shared'
import { NgIf, NgOptimizedImage } from '@angular/common'
import { TruncatePipe } from '@shared/pipes'

@Component({
	selector: 'auth-web-user',
	standalone: true,
	imports: [NgIf, NgOptimizedImage, TruncatePipe],
	templateUrl: './auth-web-user.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthWebUserComponent {
	@Input({ required: true }) user!: WebUserModel
	@Input() avatarSize = 24
	// @Input() showStatus = true
	// @Input() showName = true
	// @Input() showAvatar = true
	// @Input() showUsername = true
	// @Input() showFriends = true
}
