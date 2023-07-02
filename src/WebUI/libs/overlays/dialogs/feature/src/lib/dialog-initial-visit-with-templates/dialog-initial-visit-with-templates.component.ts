import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	Injector,
	signal,
} from '@angular/core'
import { InputSvgComponent } from '@shared/ui'
import { NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common'
import {
	DIALOG_COMPONENT,
	DialogInputInviteToProjectConfirm,
	UiStoreService,
} from '@overlays/ui-store/data-access'
import { injectAuthStore } from '@auth/data-access'
import { PROJECT_TEMPLATES, ProjectTemplate } from '@entities/shared'
import { injectProjectsStore, ProjectsLocalStorageService } from '@entities/data-access'
import { TruncatePipe } from '@shared/pipes'
import { LetDirective } from '@ngrx/component'
import { DialogBackdropTemplateComponent } from '../dialog-backdrop-template'
import { dialogInputInjectionToken } from '../dialog-renderer'

@Component({
	selector: 'dialog-initial-visit-with-templates',
	standalone: true,
	imports: [
		DialogBackdropTemplateComponent,
		InputSvgComponent,
		NgIf,
		NgForOf,
		NgClass,
		TruncatePipe,
		NgOptimizedImage,
		LetDirective,
	],
	templateUrl: './dialog-initial-visit-with-templates.component.html',
	styles: [
		`
			/* width */
			::-webkit-scrollbar {
				width: 5px;
			}

			/* Track */
			::-webkit-scrollbar-track {
				background: #f1f1f1;
			}

			/* Handle */
			::-webkit-scrollbar-thumb {
				background: #888;
			}

			/* Handle on hover */
			::-webkit-scrollbar-thumb:hover {
				background: #555;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogInitialVisitWithTemplatesComponent {
	private _uiStore = inject(UiStoreService)
	private _auth = injectAuthStore()
	private _projectsStore = injectProjectsStore()
	private _projectsLocalStorage = inject(ProjectsLocalStorageService)

	user = this._auth.select.user
	dialog = inject(Injector).get(dialogInputInjectionToken) as DialogInputInviteToProjectConfirm
	templates = PROJECT_TEMPLATES
	selectedTemplateName = signal<ProjectTemplate['name'] | undefined>(undefined)
	selectedTemplate = computed(() =>
		this.templates.find((t) => t.name === this.selectedTemplateName()),
	)
	isProjectExisting = this._projectsLocalStorage.isProjectExisting()
	protected readonly PROJECT_TEMPLATES = PROJECT_TEMPLATES

	constructor() {
		effect(
			() => {
				if (this.user()) {
					this.closeDialog()
				}
			},
			{ allowSignalWrites: true },
		)
	}

	selectTemplate(template: ProjectTemplate) {
		this.selectedTemplateName.set(template.name)
	}

	onSubmit() {
		const selectedTemplate = this.selectedTemplate()
		if (!selectedTemplate) throw new Error('No template selected')
		const user = this.user()
		if (!user && this._projectsLocalStorage.isProjectExisting()) {
			this._uiStore.dispatch.openDialog({
				component: DIALOG_COMPONENT.WARNING_TEMPLATE,
				data: {
					title: 'Warning',
					message: `Are you sure you want to load the ${selectedTemplate.templateName} template? This will overwrite your current project as you are not signed in.`,
					buttonText: 'Load Template',
					buttonAction: () =>
						this._projectsStore.dispatch.loadProjectTemplate(selectedTemplate.templateName),
				},
			})
			return
		}
		this._projectsStore.dispatch.loadProjectTemplate(selectedTemplate.templateName)
		this._uiStore.dispatch.closeDialog()
	}

	signInWithGoogle() {
		this._auth.dispatch.signInWithGoogle()
	}

	//
	// signInWithGithub() {
	// 	this._auth.dispatch.signInWithGithub()
	// }

	closeDialog() {
		this._uiStore.dispatch.closeDialog()
	}

	signInAsGuest() {
		this._auth.dispatch.signInAsGuest()

		this.closeDialog()
	}

	signInWithMicrosoft() {
		this._auth.dispatch.signInWithMicrosoft()
	}

	startWithBlankTemplate() {
		this.selectedTemplateName.set('Blank')
		this.onSubmit()
	}

	continueWithLocalSave() {
		// this._projectsStore.dispatch.loadProjectFromLocalStorage()
		this._uiStore.dispatch.closeDialog()
	}
}
