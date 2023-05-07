import { Params } from '@angular/router'
import { getRouterSelectors, RouterReducerState } from '@ngrx/router-store'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectRouter = createFeatureSelector<RouterReducerState>('router')

export const selectRouteNestedParams = createSelector(selectRouter, (router) => {
	let currentRoute = router?.state?.root
	let params: Params = {}
	while (currentRoute?.firstChild) {
		currentRoute = currentRoute.firstChild
		params = {
			...params,
			...currentRoute.params,
		}
	}
	return params
})

export const selectRouteNestedParam = (param: string) =>
	createSelector(selectRouteNestedParams, (params) => params && params[param])

export const {
	selectCurrentRoute, // select the current route
	selectFragment, // select the current route fragment
	selectQueryParams, // select the current route query params
	selectQueryParam, // factory function to select a query param
	selectRouteParams, // select the current route params
	selectRouteParam, // factory function to select a route param
	selectRouteData, // select the current route system
	selectUrl, // select the current url
	selectTitle, // Select the title if available
} = getRouterSelectors()