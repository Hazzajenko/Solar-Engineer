import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { WebUserModel } from '@auth/shared'
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common'
import { TruncatePipe } from '@shared/pipes'
import {
	ButtonAnimatedDownUpArrowComponent,
	ButtonContextMenuComponent,
	InputSvgComponent,
} from '@shared/ui'

@Component({
	selector: 'app-users-view-user-preview',
	standalone: true,
	imports: [
		NgIf,
		NgClass,
		NgOptimizedImage,
		TruncatePipe,
		InputSvgComponent,
		ButtonAnimatedDownUpArrowComponent,
		ButtonContextMenuComponent,
	],
	templateUrl: './users-view-user-preview.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersViewUserPreviewComponent {
	@Input({ required: true }) user!: WebUserModel
	@Input({ required: true }) isOpen = false

	@Output() readonly userViewToggle = new EventEmitter<WebUserModel['id']>()
	@Output() readonly userContextMenuOpen = new EventEmitter<MouseEvent>()

	toggleUserView() {
		this.userViewToggle.emit(this.user.id)
	}

	openUserContextMenu(event: MouseEvent) {
		this.userContextMenuOpen.emit(event)
	}
}
