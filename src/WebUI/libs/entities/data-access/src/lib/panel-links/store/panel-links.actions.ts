import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelLinkModel, PanelLinkRequest } from '@entities/shared'

export const PanelLinksActions = createActionGroup({
	source: 'PanelLinks Store',
	events: {
		startPanelLink: props<{
			panelLinkRequest: PanelLinkRequest
		}>(),
		endPanelLink: emptyProps(),
		addPanelLink: props<{
			panelLink: PanelLinkModel
		}>(),
		addManyPanelLinks: props<{
			panelLinks: PanelLinkModel[]
		}>(),
		updatePanelLink: props<{
			update: UpdateStr<PanelLinkModel>
		}>(),
		updateManyPanelLinks: props<{
			updates: UpdateStr<PanelLinkModel>[]
		}>(),
		deletePanelLink: props<{
			panelLinkId: string
		}>(),
		deleteManyPanelLinks: props<{
			panelLinkIds: string[]
		}>(),
		clearPanelLinksState: emptyProps(),
		Noop: emptyProps(),
	},
})
