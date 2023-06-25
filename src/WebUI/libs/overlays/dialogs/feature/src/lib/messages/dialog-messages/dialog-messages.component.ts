import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core'
import {
	injectAppUser,
	injectGroupChatsSharedStore,
	injectMessagesStore,
	injectMessagingSharedStore,
	injectUsersStore,
} from '@auth/data-access'
import { DialogBackdropTemplateComponent } from '../../dialog-backdrop-template/dialog-backdrop-template.component'
import { NgClass, NgForOf, NgIf, NgOptimizedImage, NgTemplateOutlet } from '@angular/common'
import {
	opacityInOutAnimationWithConfig,
	scaleAndOpacityAnimationWithConfig,
} from '@shared/animations'
import { DialogBackdropTemplateDirective } from '../../dialog-backdrop-template/dialog-backdrop-template.directive'
import { DialogHandleBackdropDirective } from '../../dialog-backdrop-template/dialog-handle-backdrop.directive'
import {
	GroupChatModel,
	MessageModel,
	MessagePreviewCombinedModel,
	WebUserModel,
} from '@auth/shared'
import { StandaloneDatePipe, TimeDifferenceFromNowPipe } from '@shared/pipes'
import { InputSvgComponent, SpinnerComponent } from '@shared/ui'
import { SelectedChatRoomComponent } from './selected-chat-room/selected-chat-room.component'

@Component({
	selector: 'dialog-search-for-users',
	standalone: true,
	imports: [
		DialogBackdropTemplateComponent,
		NgIf,
		DialogBackdropTemplateDirective,
		DialogHandleBackdropDirective,
		NgTemplateOutlet,
		NgForOf,
		NgOptimizedImage,
		NgClass,
		TimeDifferenceFromNowPipe,
		StandaloneDatePipe,
		SpinnerComponent,
		InputSvgComponent,
		SelectedChatRoomComponent,
		SelectedChatRoomComponent,
	],
	templateUrl: './dialog-messages.component.html',
	styles: [],
	animations: [
		opacityInOutAnimationWithConfig({
			enterSeconds: 0.3,
			leaveSeconds: 0.2,
		}),
		scaleAndOpacityAnimationWithConfig({
			enterSeconds: 0.3,
			leaveSeconds: 0.2,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogMessagesComponent {
	private _usersStore = injectUsersStore()
	private _messagesStore = injectMessagesStore()
	private _groupChatsSharedStore = injectGroupChatsSharedStore()
	private _messagingSharedStore = injectMessagingSharedStore()
	user = injectAppUser()
	latestChats = this._messagingSharedStore.select.initialLatestMessages
	private _chatsEffect = effect(() => {
		console.log('latestChats', this.latestChats())
	})
	currentSearchQuery = signal<string>('')
	searchResults = computed(() => {
		const query = this.currentSearchQuery()
		if (!query) return [] as MessagePreviewCombinedModel[]
		return this.latestChats().filter((chat) => {
			return chat.chatName.toLowerCase().includes(query.toLowerCase())
		})
	})
	selectedChatId = signal<MessagePreviewCombinedModel['id'] | undefined>(undefined)
	selectedChatRoom = computed(() => {
		const selectedChatId = this.selectedChatId()
		if (!selectedChatId) return undefined
		return this.latestChats().find((chat) => chat.id === selectedChatId)
	})
	_selectedChatRoomEff = effect(() => {
		console.log('selectedChatRoom', this.selectedChatRoom())
	})
	selectedUserChat = computed(() => {
		const selectedChatId = this.selectedChatId()
		if (!selectedChatId) return undefined
		const latestChat = this.latestChats().find((chat) => chat.id === selectedChatId)
		if (latestChat && !latestChat.isGroup) {
			const userChat = this._messagesStore.select.allUserMessagesByUserId(latestChat.id)()
			if (!userChat) throw new Error('User chat not found')
			return userChat
		}
		return undefined
	})

	selectedGroupChat = computed(() => {
		const selectedChatId = this.selectedChatId()
		if (!selectedChatId) return undefined
		const latestChat = this.latestChats().find((chat) => chat.id === selectedChatId)
		// if (latestChat && latestChat.isGroup) {
		// 	const groupChat = this._groupChatsSharedStore.select.groupChatById(latestChat.id)()
		// 	if (!groupChat) throw new Error('Group chat not found')
		// 	return groupChat
		// }
		return undefined
	})
	userSearchResults = this._usersStore.select.userSearchResults
	fourMostRecentFriends = this._usersStore.select.fourMostRecentFriends
	isUserInSearch = signal(false)
	loadingResults = signal(false)
	private _receiveResultsEffect = effect(
		() => {
			this.userSearchResults()
			this.loadingResults.set(false)
		},
		{ allowSignalWrites: true },
	)
	selectedUserIdSearchResult = signal<WebUserModel['id'] | undefined>(undefined)
	searchHistory = signal<WebUserModel[]>(this.fourMostRecentFriends())
	isAUserSelected = computed(() => {
		return !!this.selectedUserIdSearchResult()
	})
	/*	isAChatSelected = computed(() => {
	 if (this.selectedChatId()){
	 return true
	 }

	 })*/
	selectedUserSearchResult = computed(() => {
		const id = this.selectedUserIdSearchResult()
		if (!id) {
			return undefined
		}
		return this._usersStore.select.getById(id)()
	})

	lastKeyUpTime = 0

	webUserTrackByFn(index: number, item: WebUserModel) {
		return item.id || index
	}

	latestChatTrackByFn(index: number, item: MessagePreviewCombinedModel) {
		return item.id || index
	}

	userMessageTrackByFn(index: number, item: MessageModel) {
		return item.id || index
	}

	groupChatTrackByFn(index: number, item: GroupChatModel) {
		return item.id || index
	}

	onSearchBoxKeyDown(event: KeyboardEvent) {
		event.preventDefault()
		event.stopPropagation()

		if (!this.isUserInSearch()) {
			this.isUserInSearch.set(true)
		}

		const target = event.target as HTMLInputElement
		const value = target.value
		console.log(value)
		/*		if (event.key === 'Enter') {
		 this.querySearchBox(value)
		 return
		 }*/

		if (value.length > 0) {
			this.loadingResults.set(true)
		} else {
			this.loadingResults.set(false)
			this.isUserInSearch.set(false)
			// this._usersStore.dispatch.clearUserSearchResults()
			return
		}

		this.currentSearchQuery.set(value)
	}

	selectChat(chat: MessagePreviewCombinedModel) {
		this.selectedChatId.set(chat.id)
		if (chat.isGroup) {
			// this._groupChatsSharedStore.dispatch.fetchGroupChatById({
			// 	groupChatId: chat.id,
			// })
			return
		}
		this._messagesStore.dispatch.fetchMessagesByUserId({
			userId: chat.chatId,
		})
	}

	selectSearchResult(user: WebUserModel) {
		if (this.selectedUserIdSearchResult() === user.id) {
			this.selectedUserIdSearchResult.set(undefined)
			return
		}
		this.selectedUserIdSearchResult.set(user.id)
		const history = this.searchHistory()
		const index = history.findIndex((x) => x.id === user.id)
		if (index < 0) {
			this.searchHistory.mutate((x) => x.push(user))
		}
	}

	private querySearchBox(value: string) {
		if (Date.now() - this.lastKeyUpTime < 500) {
			return
		}

		this._usersStore.dispatch.searchForAppUser({
			searchQuery: value,
		})
	}
}
