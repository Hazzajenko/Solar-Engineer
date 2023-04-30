import { DesignCanvasDirective } from './design-canvas.directive'
import {
	CanvasGraphicsMenuComponent,
	KeyMapComponent,
	RightClickMenuComponent,
	StateValuesComponent,
} from './menus'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { LetModule } from '@ngrx/component'
import { ShowSvgComponent } from '@shared/ui'


@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CdkDrag,
		CommonModule,
		ShowSvgComponent,
		LetModule,
		KeyMapComponent,
		CanvasGraphicsMenuComponent,
		StateValuesComponent,
		RightClickMenuComponent,
		DesignCanvasDirective,
	],
	selector: 'app-design-canvas-app',
	standalone: true,
	styles: [],
	templateUrl: './design-canvas-app.component.html',
})
export class DesignCanvasAppComponent implements OnInit {
	ngOnInit() {
		console.log(this.constructor.name, 'ngOnInit')
	}
}