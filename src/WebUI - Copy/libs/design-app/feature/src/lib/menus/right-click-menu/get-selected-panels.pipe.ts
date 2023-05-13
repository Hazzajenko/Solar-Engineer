import { Pipe, PipeTransform } from '@angular/core'
import { ContextMenuState, isMultipleEntitiesContextMenuTemplate } from '@design-app/data-access'


@Pipe({
	name: 'getSelectedPanels',
	standalone: true,
})
export class GetSelectedPanelsPipe implements PipeTransform {
	transform(menu: ContextMenuState): string[] | undefined {
		if (!isMultipleEntitiesContextMenuTemplate(menu)) return
		return menu.ids
	}
}