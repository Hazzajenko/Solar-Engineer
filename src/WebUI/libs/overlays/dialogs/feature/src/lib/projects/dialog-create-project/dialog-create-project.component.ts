import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	Signal,
	signal,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
} from '@angular/core'
import { DialogBackdropTemplateComponent } from '../../dialog-backdrop-template/dialog-backdrop-template.component'
import { NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle } from '@angular/common'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import {
	TAILWIND_COLOUR_500,
	TAILWIND_COLOUR_500_VALUES,
	TailwindColor500,
} from '@shared/data-access/models'
import { LetDirective } from '@ngrx/component'
import { injectProjectsStore } from '@entities/data-access'
import { injectUiStore } from '@overlays/ui-store/data-access'
import { SpinnerComponent } from '@shared/ui'
import { injectUsersStore } from '@auth/data-access'
import { MultiSelectModule } from 'primeng/multiselect'
import { WebUserModel } from '@auth/shared'
import { CenterThisElementDirective } from '@shared/directives'
import { TruncatePipe } from '@shared/pipes'
import { AuthWebUserComponent } from '@auth/ui'
import { PROJECT_TEMPLATES, ProjectTemplatePreviewModel } from '@entities/shared'
import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'

@Component({
	selector: 'dialog-create-project',
	standalone: true,
	imports: [
		DialogBackdropTemplateComponent,
		NgOptimizedImage,
		ReactiveFormsModule,
		NgForOf,
		NgStyle,
		LetDirective,
		NgClass,
		NgIf,
		SpinnerComponent,
		MultiSelectModule,
		FormsModule,
		CenterThisElementDirective,
		TruncatePipe,
		AuthWebUserComponent,
	],
	templateUrl: './dialog-create-project.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogCreateProjectComponent {
	private _fb = inject(FormBuilder)
	private _projects = injectProjectsStore()
	private _uiStore = injectUiStore()
	private _usersStore = injectUsersStore()
	private _selectTemplateOverlay: OverlayRef | undefined
	private _viewContainerRef = inject(ViewContainerRef)
	private _overlay = inject(Overlay)
	@ViewChild('selectTemplateDialog') private _selectTemplateDialog!: TemplateRef<unknown>
	templates = PROJECT_TEMPLATES

	selectedTemplateName = signal<ProjectTemplatePreviewModel['name'] | undefined>(undefined)
	selectedTemplate = computed(() =>
		this.templates.find((t) => t.name === this.selectedTemplateName()),
	)
	friends = this._usersStore.select.allFriends as Signal<WebUserModel[]>
	recentFriends = this._usersStore.select.fourMostRecentFriends
	allFriendsGroupedByFirstLetter = this._usersStore.select.allFriendsGroupedByFirstLetter
	multiSelectedFriendIds = signal<string[]>([])
	selectedFriends = [] as WebUserModel[]
	loading = signal(false)
	createProjectForm = this._fb.group({
		name: ['', [Validators.required, Validators.minLength(4)]],
		colour: [TAILWIND_COLOUR_500.blue as string, [Validators.required]],
	})
	protected readonly TAILWIND_COLOUR_500_VALUES = TAILWIND_COLOUR_500_VALUES

	selectTemplate(template: ProjectTemplatePreviewModel) {
		this.selectedTemplateName.set(template.name)
	}

	setColour(colour: TailwindColor500) {
		this.createProjectForm.get('colour')?.setValue(colour)
	}

	onSubmit() {
		if (!this.createProjectForm.valid) {
			console.error('Invalid Form')
			return
		}

		const name = this.createProjectForm.get('name')?.value
		const colour = this.createProjectForm.get('colour')?.value

		if (!name || !colour) {
			throw new Error('Name or colour is undefined')
		}

		const memberIds = this.multiSelectedFriendIds()
		console.log('memberIds', memberIds)

		this._projects.dispatch.createProjectSignalr({
			name,
			colour,
			memberIds,
		})

		this.loading.set(true)
		setTimeout(() => {
			this._uiStore.dispatch.closeDialog()
		}, 100)
	}

	openSelectTemplateDialog() {
		this._selectTemplateOverlay = this._overlay.create({
			hasBackdrop: true,
			scrollStrategy: this._overlay.scrollStrategies.block(),
		})

		this._selectTemplateOverlay.attach(
			new TemplatePortal(this._selectTemplateDialog, this._viewContainerRef),
		)
	}

	inputChange() {
		const name = this.createProjectForm.get('name')?.value
		if (!name) {
			return
		}

		if (name.length < 4) {
			return
		}

		this.createProjectForm.controls.name.markAsTouched()
		this.createProjectForm.controls.name.updateValueAndValidity()
	}

	multiSelectFriend(friend: WebUserModel) {
		if (this.multiSelectedFriendIds().includes(friend.id)) {
			this.multiSelectedFriendIds.set(
				this.multiSelectedFriendIds().filter((id) => id !== friend.id),
			)
			return
		}
		this.multiSelectedFriendIds.set([...this.multiSelectedFriendIds(), friend.id])
	}
}
