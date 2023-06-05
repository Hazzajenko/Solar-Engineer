import { ChangeDetectionStrategy, Component, inject, Injector, OnInit } from '@angular/core'
import {
	CONTEXT_MENU_COMPONENT,
	ContextMenuInput,
	ContextMenuProjectMenu,
	DIALOG_COMPONENT,
	injectUiStore,
	uiFeature,
} from '@overlays/ui-store/data-access'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { injectProjectsStore, selectProjectsEntities } from '@entities/data-access'
import { ProjectModel } from '@entities/shared'
import { ContextMenuDirective } from '../directives'
import { LetDirective } from '@ngrx/component'
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { increaseScaleAndOpacity } from '@shared/animations'
import { createSelector } from '@ngrx/store'
import { Dictionary } from '@ngrx/entity'
import { assertNotNull, selectSignalFromStore } from '@shared/utils'
import { TAILWIND_COLOUR_500_VALUES, TailwindColor500 } from '@shared/data-access/models'

export const selectProjectByContextMenuData = createSelector(
	uiFeature.selectCurrentContextMenu,
	selectProjectsEntities,
	(contextMenuInput: ContextMenuInput | undefined, projects: Dictionary<ProjectModel>) => {
		if (!contextMenuInput) return undefined
		if (!('projectId' in contextMenuInput.data)) return undefined
		return projects[contextMenuInput.data.projectId]
	},
)

@Component({
	selector: 'context-menu-project',
	standalone: true,
	imports: [
		ContextMenuDirective,
		LetDirective,
		NgIf,
		ShowSvgComponent,
		ShowSvgNoStylesComponent,
		NgForOf,
		NgClass,
		NgStyle,
	],
	templateUrl: './context-menu-project.component.html',
	styles: [],
	animations: [increaseScaleAndOpacity],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuProjectComponent implements OnInit {
	private _projectsStore = injectProjectsStore()
	private _uiStore = injectUiStore()

	id = CONTEXT_MENU_COMPONENT.PROJECT_MENU
	contextMenu = inject(Injector).get(contextMenuInputInjectionToken) as ContextMenuProjectMenu
	project = selectSignalFromStore(selectProjectByContextMenuData)

	protected readonly TAILWIND_COLOUR_500_VALUES = TAILWIND_COLOUR_500_VALUES

	ngOnInit() {
		console.log('contextMenuProject', this.contextMenu)
		console.log('project', this.project())
		// const { projectId } = this.contextMenu.data
		// this.project = this._projectsStore.select.selectById(projectId)
	}

	setProjectColour(colour: TailwindColor500) {
		const project = this.project()
		assertNotNull(project)
		this._projectsStore.dispatch.updateProject({
			id: project.id,
			changes: { colour },
		})
	}

	deleteProject(project: ProjectModel) {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.DELETE_PROJECT_WARNING,
			data: { projectId: project.id },
		})
	}
}
