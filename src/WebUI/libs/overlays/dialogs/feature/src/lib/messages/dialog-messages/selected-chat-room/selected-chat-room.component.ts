import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	Input,
	OnDestroy,
	OnInit,
	Signal,
	ViewContainerRef,
} from '@angular/core'
import { InputSvgComponent } from '@shared/ui'
import {
	NgClass,
	NgForOf,
	NgIf,
	NgOptimizedImage,
	NgStyle,
	NgTemplateOutlet,
} from '@angular/common'
import { MessageModel, MessagePreviewCombinedModel, UserToUserChatRoom } from '@auth/shared'
import { StandaloneDatePipe, TimeDifferenceFromNowPipe } from '@shared/pipes'
import { LetDirective } from '@ngrx/component'
import { MatRippleModule } from '@angular/material/core'
import { opacityInOutAnimation } from '@shared/animations'
import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { injectProjectsStore } from '@entities/data-access'
import { DialogBackdropTemplateComponent } from '../../../dialog-backdrop-template/dialog-backdrop-template.component'
import { DialogWarningTemplateInputsComponent } from '../../../shared'
import { injectAppUser, injectMessagesStore, injectUsersStore } from '@auth/data-access'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { TextFieldModule } from '@angular/cdk/text-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'selected-chat-room',
	standalone: true,
	imports: [
		InputSvgComponent,
		NgIf,
		NgOptimizedImage,
		TimeDifferenceFromNowPipe,
		StandaloneDatePipe,
		LetDirective,
		MatRippleModule,
		NgTemplateOutlet,
		NgForOf,
		NgStyle,
		DialogBackdropTemplateComponent,
		DialogWarningTemplateInputsComponent,
		MatIconModule,
		MatFormFieldModule,
		TextFieldModule,
		MatInputModule,
		MatButtonModule,
		NgClass,
	],
	templateUrl: './selected-chat-room.component.html',
	styleUrls: [],
	animations: [opacityInOutAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedChatRoomComponent implements OnInit, OnDestroy {
	private _messagesStore = injectMessagesStore()
	private _userOptionsOverlay: OverlayRef | undefined
	private _childSubMenuOverlay: OverlayRef | undefined
	private _viewContainerRef = inject(ViewContainerRef)
	private _overlay = inject(Overlay)
	private _projectsStore = injectProjectsStore()
	private _usersStore = injectUsersStore()
	// private _chatRoomPreview!: MessagePreviewCombinedModel
	@Input({ required: true }) chatRoomPreview!: MessagePreviewCombinedModel
	chatRoom!: Signal<UserToUserChatRoom>

	// chatRoom!: Signal<UserToUserChatRoom>
	user = injectAppUser()
	_eff = effect(() => {
		console.log('chatRoom', this.chatRoom())
	})

	ngOnInit() {
		console.log('SelectedChatRoomComponent', this.chatRoomPreview)
		this.chatRoom = this._messagesStore.select.allUserMessagesByUserId(this.chatRoomPreview.chatId)
	}

	/*	@Input({ required: true }) set chatRoomPreview(value: MessagePreviewCombinedModel) {
	 this._chatRoomPreview = value
	 this.chatRoom = this._messagesStore.select.allUserMessagesByUserId(value.id)
	 }*/

	userMessageTrackByFn(index: number, item: MessageModel) {
		return item.id || index
	}

	ngOnDestroy() {
		this._userOptionsOverlay?.dispose()
		this._childSubMenuOverlay?.dispose()
	}
}
