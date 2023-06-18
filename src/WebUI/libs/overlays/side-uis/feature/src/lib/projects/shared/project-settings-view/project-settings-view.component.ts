import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { ProjectWebModel } from '@entities/shared'
import { injectAppUser } from '@auth/data-access'
import {
	TAILWIND_COLOUR_500,
	TAILWIND_COLOUR_500_VALUES,
	TailwindColor500,
} from '@shared/data-access/models'
import { AuthWebUserAvatarComponent } from '@auth/ui'
import { LetDirective } from '@ngrx/component'
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { TruncatePipe } from '@shared/pipes'
import { SideUiViewHeadingComponent } from '../../../shared'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { InputSvgComponent } from '@shared/ui'

@Component({
	selector: 'app-project-settings-view',
	standalone: true,
	imports: [
		AuthWebUserAvatarComponent,
		LetDirective,
		NgForOf,
		TruncatePipe,
		NgIf,
		NgStyle,
		NgClass,
		SideUiViewHeadingComponent,
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		InputSvgComponent,
	],
	templateUrl: './project-settings-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSettingsViewComponent {
	private _fb = inject(FormBuilder)
	private _project!: ProjectWebModel
	user = injectAppUser()
	updateProjectForm = this._fb.group({
		name: ['', [Validators.required, Validators.minLength(4)]],
		colour: [TAILWIND_COLOUR_500.blue as string, [Validators.required]],
	})
	updateProjectNameForm = this._fb.group({
		name: ['', [Validators.required, Validators.minLength(4)]],
	})
	loading = signal(false)
	editingProjectName = signal(false)
	protected readonly TAILWIND_COLOUR_500_VALUES = TAILWIND_COLOUR_500_VALUES

	get project() {
		return this._project
	}

	@Input({ required: true }) set project(value: ProjectWebModel) {
		this._project = value
		this.updateProjectNameForm.patchValue({
			name: value.name,
		})
		this.updateProjectForm.patchValue({
			name: value.name,
			colour: value.colour,
		})
	}

	setColour(colour: TailwindColor500) {
		this.updateProjectForm.get('colour')?.setValue(colour)
	}

	updateProject() {
		if (!this.updateProjectForm.valid) {
			console.error('Invalid Form')
			return
		}

		const name = this.updateProjectForm.get('name')?.value
		const colour = this.updateProjectForm.get('colour')?.value

		if (!name || !colour) {
			throw new Error('Name or colour is undefined')
		}

		this.loading.set(true)
		setTimeout(() => {
			console.log('Updating project')
		}, 100)
	}

	inputChange() {
		const name = this.updateProjectForm.get('name')?.value
		if (!name) {
			return
		}

		if (name.length < 4) {
			return
		}

		this.updateProjectForm.controls.name.markAsTouched()
		this.updateProjectForm.controls.name.updateValueAndValidity()
	}

	startEditingProjectName() {
		this.editingProjectName.set(true)
	}
}
