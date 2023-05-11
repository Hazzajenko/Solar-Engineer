import { ComponentRef, Directive, inject, Input, OnDestroy, ViewContainerRef } from '@angular/core'
import { GraphicsSettingsComponent, KeyMapSettingsComponent } from './dialogs'

export const DYNAMIC_COMPONENT_TYPE = {
	APP_CANVAS_GRAPHICS_SETTINGS: 'app-canvas-graphics-settings',
	APP_KEY_MAP_SETTINGS: 'app-key-map-settings',
} as const

export type DynamicComponentType =
	(typeof DYNAMIC_COMPONENT_TYPE)[keyof typeof DYNAMIC_COMPONENT_TYPE]

/*export const DYNAMIC_COMPONENT_TYPE = {
 APP_CANVAS_GRAPHICS_SETTINGS: 'app-canvas-graphics-settings',
 APP_KEY_MAP_SETTINGS: 'app-key-map-settings',
 } as const

 export type DynamicComponentType =
 (typeof DYNAMIC_COMPONENT_TYPE)[keyof typeof DYNAMIC_COMPONENT_TYPE]

 const componentStringToType = {
 [DYNAMIC_COMPONENT_TYPE.APP_CANVAS_GRAPHICS_SETTINGS]: () =>
 import('./dialogs/app-settings-dialog/graphics-settings/graphics-settings.component').then(
 (m) => m.GraphicsSettingsComponent,
 ),
 [DYNAMIC_COMPONENT_TYPE.APP_KEY_MAP_SETTINGS]: () =>
 import('./dialogs/app-settings-dialog/key-map-settings/key-map-settings.component').then(
 (m) => m.KeyMapSettingsComponent,
 ),
 }
 const componentStringToTypeV2 = {
 [DYNAMIC_COMPONENT_TYPE.APP_CANVAS_GRAPHICS_SETTINGS]: GraphicsSettingsComponent,
 [DYNAMIC_COMPONENT_TYPE.APP_KEY_MAP_SETTINGS]: KeyMapSettingsComponent,
 }*/

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
			default:
				throw new Error('Invalid component type')
		}
	}

	ngOnDestroy(): void {
		this.componentRef?.destroy()
	}
}
