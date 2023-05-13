import {
	ComponentRef,
	Directive,
	inject,
	Input,
	NgZone,
	OnDestroy,
	OnInit,
	ViewContainerRef,
} from '@angular/core'
import { ENTITY_TYPE, EntityType } from '@design-app/shared'
import { PanelComponent } from 'deprecated/design-app/feature-panel'

@Directive({
	selector: '[appDynamicEntity]',
	standalone: true,
})
export class DynamicComponentDirective implements OnInit, OnDestroy {
	private _ngZone = inject(NgZone)
	private _viewContainerRef = inject(ViewContainerRef)

	designPanelComponentRef?: ComponentRef<PanelComponent>

	@Input() set entity(entity: { id: string; type: EntityType }) {
		console.log('entity', entity)
		this._ngZone.runOutsideAngular(() => {
			switch (entity.type) {
				case ENTITY_TYPE.Panel:
					this.createPanelComponent(entity.id)
					break
			}
		})
	}

	ngOnInit() {
		console.log(this.constructor.name, 'ngOnInit')
	}

	private createPanelComponent(entityId: string) {
		console.log('createPanelComponent', entityId)
		this._viewContainerRef.clear()

		this.designPanelComponentRef =
			this._viewContainerRef.createComponent<PanelComponent>(PanelComponent)

		this.designPanelComponentRef.instance.panelId = entityId
		// this.designPanelComponentRef.setInput('panelId', entityId)
	}

	ngOnDestroy(): void {
		console.log('destroy')
		this.designPanelComponentRef?.destroy()
	}
}
