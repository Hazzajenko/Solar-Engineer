import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core'
import { injectAppUser, injectUsersStore } from '@auth/data-access'
import { DialogBackdropTemplateComponent } from '../../dialog-backdrop-template/dialog-backdrop-template.component'
import { NgClass, NgForOf, NgIf, NgOptimizedImage, NgTemplateOutlet } from '@angular/common'
import {
	opacityInOutAnimationWithConfig,
	scaleAndOpacityAnimationWithConfig,
} from '@shared/animations'
import { DialogBackdropTemplateDirective } from '../../dialog-backdrop-template/dialog-backdrop-template.directive'
import { DialogHandleBackdropDirective } from '../../dialog-backdrop-template/dialog-handle-backdrop.directive'
import { WebUserModel } from '@auth/shared'
import { StandaloneDatePipe, TimeDifferenceFromNowPipe } from '@shared/pipes'
import { InputSvgComponent, SpinnerComponent } from '@shared/ui'
import { injectProjectsStore } from '@entities/data-access'
import { selectSignalFromStore } from '@shared/utils'
import { selectAllWebProjects } from '@overlays/side-uis/feature'

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
	],
	templateUrl: './dialog-search-for-projects.component.html',
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
export class DialogSearchForProjectsComponent {
	private _usersStore = injectUsersStore()
	private _projectsStore = injectProjectsStore()
	projects = selectSignalFromStore(selectAllWebProjects)
	user = injectAppUser()
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

	onSearchBoxKeyDown(event: KeyboardEvent) {
		event.preventDefault()
		event.stopPropagation()

		if (!this.isUserInSearch()) {
			this.isUserInSearch.set(true)
		}

		const target = event.target as HTMLInputElement
		const value = target.value
		console.log(value)
		if (event.key === 'Enter') {
			this.querySearchBox(value)
			return
		}

		if (value.length > 0) {
			this.loadingResults.set(true)
		} else {
			this.loadingResults.set(false)
			this.isUserInSearch.set(false)
			this._usersStore.dispatch.clearUserSearchResults()
			return
		}

		this.lastKeyUpTime = Date.now()
		setTimeout(() => {
			this.querySearchBox(value)
		}, 500)
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
