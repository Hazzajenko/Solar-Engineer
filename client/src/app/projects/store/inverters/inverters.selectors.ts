import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as State from "./inverters.reducer";
import { selectRouteParams } from "../../../store/router.selectors";
import { InverterModel } from "../../models/inverter.model";

export const selectInvertersState =
	createFeatureSelector<State.InverterState>("inverters");

export const selectInverterEntities = createSelector(
	selectInvertersState,
	State.selectEntities,
);

export const selectAllInverters = createSelector(
	selectInvertersState,
	State.selectAll,
);

export const selectInverterByRouteParams = createSelector(
	selectInverterEntities,
	selectRouteParams,
	(inverters, { inverterId }) => inverters[inverterId],
);

export const selectInvertersByProjectIdRouteParams = createSelector(
	selectAllInverters,
	selectRouteParams,
	(inverters, { projectId }) =>
		inverters.filter((inverter) => inverter.project_id === Number(projectId)),
);

export const selectInverterById = (props: { id: number }) =>
	createSelector(selectAllInverters, (inverters: InverterModel[]) =>
		inverters.find((inverter) => inverter.id === props.id),
	);

export const selectInvertersByProjectId = (props: { projectId: number }) =>
	createSelector(selectAllInverters, (inverters: InverterModel[]) =>
		inverters.filter(
			(inverter) => inverter.project_id === Number(props.projectId),
		),
	);
/*

export const getCount = (props: {id: number, multiply:number}) =>
  createSelector(
    (state) => state.counter[props.id],
    (counter) => counter * props.multiply
  );
*/
