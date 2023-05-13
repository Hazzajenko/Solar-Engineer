import { ComponentRef, Directive, inject, Input, OnDestroy, ViewContainerRef } from '@angular/core'
import { GraphicsSettingsComponent, KeyMapSettingsComponent } from '@overlays/dialogs/feature'

export const DYNAMIC_COMPONENT_TYPE = {
	APP_CANVAS_GRAPHICS_SETTINGS: 'app-canvas-graphics-settings',
	APP_KEY_MAP_SETTINGS: 'app-key-map-settings', // APP_DISPLAY_SETTINGS: 'app-display-settings',
} as const

export type DynamicComponentType =
	(typeof DYNAMIC_COMPONENT_TYPE)[keyof typeof DYNAMIC_COMPONENT_TYPE]

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[appCreateComponent]',
	standalone: true,
})
export class CreateComponentDirective implements OnDestroy {
	private _viewContainerRef = inject(ViewContainerRef)
	componentRef?: ComponentRef<unknown>

	@Input({ required: true }) set dynamicComponent(input: DynamicComponentType) {
		this._viewContainerRef.clear()
		this.componentRef = this.bigSwitch(input)
	}

	/*	@Input() set typeOfComponent(input: ComponentType<any>) {
	 this._viewContainerRef.clear()
	 this.componentRef = this._viewContainerRef.createComponent(input)
	 }*/

	bigSwitch(input: DynamicComponentType) {
		switch (input) {
			case DYNAMIC_COMPONENT_TYPE.APP_CANVAS_GRAPHICS_SETTINGS:
				return this._viewContainerRef.createComponent<GraphicsSettingsComponent>(
					GraphicsSettingsComponent,
				)
			case DYNAMIC_COMPONENT_TYPE.APP_KEY_MAP_SETTINGS:
				return this._viewContainerRef.createComponent<KeyMapSettingsComponent>(
					KeyMapSettingsComponent,
				)
			/*			case DYNAMIC_COMPONENT_TYPE.APP_DISPLAY_SETTINGS:
			 return this._viewContainerRef.createComponent<DisplaySettingsComponent>(
			 DisplaySettingsComponent,
			 )*/
			default:
				throw new Error('Invalid component type')
		}
	}

	ngOnDestroy(): void {
		this.componentRef?.destroy()
	}
}
