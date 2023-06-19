import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { ProjectWebModel } from '@entities/shared'
import { injectAppUser } from '@auth/data-access'
import { TAILWIND_COLOUR_500_VALUES, TailwindColor500 } from '@shared/data-access/models'
import { AuthWebUserAvatarComponent } from '@auth/ui'
import { InputSvgComponent, SpinnerComponent } from '@shared/ui'
import { LetDirective } from '@ngrx/component'
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { TruncatePipe } from '@shared/pipes'
import { SideUiViewHeadingComponent } from '../../../shared'
import { injectProjectsStore } from '@entities/data-access'
import { PluralizePipe } from '@shared/utils'
import { FilterProjectMembersByOnlinePipe } from '@entities/utils'

@Component({
	selector: 'app-project-profile-view',
	standalone: true,
	imports: [
		AuthWebUserAvatarComponent,
		InputSvgComponent,
		LetDirective,
		NgForOf,
		NgIf,
		TruncatePipe,
		NgClass,
		NgStyle,
		SideUiViewHeadingComponent,
		SpinnerComponent,
		ReactiveFormsModule,
		FilterProjectMembersByOnlinePipe,
		PluralizePipe,
	],
	templateUrl: './project-profile-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectProfileViewComponent {
	private _fb = inject(FormBuilder)
	private _project!: ProjectWebModel
	private _projectsStore = injectProjectsStore()
	user = injectAppUser()
	updateProjectNameForm = this._fb.group({
		name: ['', [Validators.required, Validators.minLength(4)]],
	})

	updateProjectColourForm = this._fb.group({
		colour: ['', [Validators.required, Validators.minLength(4)]],
	})
	loading = signal(false)
	editingProjectName = signal(false)
	editingProjectColour = signal(false)
	projectNameFormValid = signal(false)

	protected readonly TAILWIND_COLOUR_500_VALUES = TAILWIND_COLOUR_500_VALUES

	get project() {
		return this._project
	}

	@Input({ required: true }) set project(value: ProjectWebModel) {
		this._project = value
		this.updateProjectNameForm.patchValue({
			name: value.name,
		})
		this.updateProjectColourForm.patchValue({
			colour: value.colour,
		})
	}

	onProjectNameFormKeyUp(event: KeyboardEvent) {
		event.preventDefault()
		event.stopPropagation()

		const target = event.target as HTMLInputElement
		const value = target.value
		console.log(value)
		if (!value) {
			return
		}

		if (value.length < 4) {
			this.projectNameFormValid.set(false)
			return
		}

		this.projectNameFormValid.set(true)
	}

	setColour(colour: TailwindColor500) {
		console.log(colour)
		if (!this.editingProjectColour()) return
		this.updateProjectColourForm.controls.colour.setValue(colour)
	}

	toggleEditingProjectName() {
		this.editingProjectName.update((value) => !value)
	}

	saveProjectName() {
		if (!this.updateProjectNameForm.valid) {
			console.error('Invalid UpdateProjectNameForm')
			return
		}

		const name = this.updateProjectNameForm.controls.name.value

		if (!name) {
			throw new Error('Name is undefined')
		}

		this._projectsStore.dispatch.updateProject({
			id: this.project.id,
			changes: {
				name,
			},
		})
		this.editingProjectName.set(false)
	}

	saveProjectColour() {
		if (!this.updateProjectColourForm.valid) {
			console.error('Invalid UpdateProjectColourForm')
			return
		}

		const colour = this.updateProjectColourForm.controls.colour.value
		console.log(colour)

		if (!colour) {
			throw new Error('Colour is undefined')
		}

		this._projectsStore.dispatch.updateProject({
			id: this.project.id,
			changes: {
				colour,
			},
		})
		this.editingProjectColour.set(false)
	}

	toggleEditingProjectColour() {
		this.editingProjectColour.update((value) => !value)
	}
}
