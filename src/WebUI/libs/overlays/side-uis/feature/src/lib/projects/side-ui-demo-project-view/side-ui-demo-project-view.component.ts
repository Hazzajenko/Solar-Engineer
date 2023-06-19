import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import { ProjectId, ProjectWebModel } from '@entities/shared'
import { injectAppUser } from '@auth/data-access'
import { InputSvgComponent } from '@shared/ui'
import { NgIf } from '@angular/common'
import { ProjectDataViewComponent } from '../shared'
import {
	sideUiInjectionToken,
	SideUiNavBarView,
} from '../../side-ui-nav-bar/side-ui-nav-bar.component'
import { SideUiBaseComponent } from '../../side-ui-base/side-ui-base.component'

@Component({
	selector: 'app-side-ui-demo-project-view',
	standalone: true,
	imports: [InputSvgComponent, NgIf, ProjectDataViewComponent, SideUiBaseComponent],
	templateUrl: './side-ui-demo-project-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiDemoProjectViewComponent {
	demoProject: ProjectWebModel = {
		id: 'demo' as ProjectId,
		name: 'Demo Project',
		memberIds: ['demo'],
		members: [],
		colour: '#000000',
		createdById: 'demo',
		createdTime: '0',
		lastModifiedTime: '0',
	}
	user = injectAppUser()
	sideUiView = inject(Injector).get(sideUiInjectionToken) as SideUiNavBarView
}
