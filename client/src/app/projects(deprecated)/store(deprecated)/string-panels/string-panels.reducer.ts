import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import * as StringPanelsActions from "./string-panels.actions";
import { StringPanelModel } from "../../models/deprecated-for-now/string-panel.model";

export const selectStringPanelId = (b: StringPanelModel): number => b.id;

export const stringPanelAdapter: EntityAdapter<StringPanelModel> =
	createEntityAdapter<StringPanelModel>({
		selectId: selectStringPanelId,
	});

export const initialStringPanelsState = stringPanelAdapter.getInitialState({});

export const stringPanelsReducer = createReducer(
	initialStringPanelsState,

	on(StringPanelsActions.addStringPanel, (state, { stringPanel }) =>
		stringPanelAdapter.addOne(stringPanel, state),
	),

	on(StringPanelsActions.addStringPanels, (state, { stringPanels }) =>
		stringPanelAdapter.addMany(stringPanels, state),
	),
);

export const { selectIds, selectEntities, selectAll } =
	stringPanelAdapter.getSelectors();

export type StringPanelState = EntityState<StringPanelModel>;
