import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { WebUserModel } from '@auth/shared'
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common'
import { StandaloneDatePipe, TimeDifferenceFromNowPipe, TruncatePipe } from '@shared/pipes'
import { ButtonAnimatedDownUpArrowComponent, InputSvgComponent } from '@shared/ui'
import { DefaultHoverEffectsDirective } from '@shared/directives'
import { MatTooltipModule } from '@angular/material/tooltip'
import { LetDirective } from '@ngrx/component'

@Component({
	selector: 'app-users-view-web-user-item',
	standalone: true,
	imports: [
		NgIf,
		NgClass,
		NgOptimizedImage,
		TruncatePipe,
		InputSvgComponent,
		ButtonAnimatedDownUpArrowComponent,
		DefaultHoverEffectsDirective,
		MatTooltipModule,
		TimeDifferenceFromNowPipe,
		StandaloneDatePipe,
		LetDirective,
	],
	templateUrl: './users-view-web-user-item.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersViewWebUserItemComponent {
	@Input({ required: true }) friend!: WebUserModel
	@Output() readonly userViewToggle = new EventEmitter<string>()
	@Output() readonly userContextMenuOpen = new EventEmitter<MouseEvent>()
	@Output() readonly userOptionsDialogOpen = new EventEmitter<MouseEvent>()

	openUserOptionsDialog(event: MouseEvent) {
		this.userOptionsDialogOpen.emit(event)
	}
}
