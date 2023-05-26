import { createActionGroup } from '@ngrx/store'
import { PanelLinksActions } from '@entities/data-access'
// import { PanelsActions } from '@entities/data-access'

export type ActionGroup = ReturnType<typeof createActionGroup>

/*export const getAllActionKeys = (actionGroup: ActionGroup) => {
 return Object.keys(actionGroup).map((key) => key as keyof typeof actionGroup)
 }*/
export const getAllActions = (actionGroup: ActionGroup) => {
	return Object.keys(actionGroup).map((key) => actionGroup[key as keyof typeof actionGroup])
}

/*type ActionByKey<
 TActionGroup extends ActionGroup,
 TKey extends string & keyof TActionGroup,
 > = TActionGroup[TKey]*/

// const sumAction: ActionByKey<typeof PanelsActions, 'addPanel'> = PanelsActions.addPanel
/*
 const data = {
 addPanel: PanelsActions.addPanel(),
 addManyPanels: PanelsActions.addManyPanels(),
 updatePanel: PanelsActions.updatePanel(),
 } as const

 export type Data = (typeof data)[keyof typeof data]
 const dataaa: Data = PanelsActions.addPanel()*/

// export type ActionKeys = (typeof PanelsActions)[keyof typeof PanelsActions]['type']
// const what: ActionKeys = '[Panels Store] Add Many Panels'
export const getAllActionsExcept = <
	TActionGroup extends ActionGroup,
	TActionKey extends keyof TActionGroup,
>(
	actionGroup: TActionGroup,
	actions: TActionKey[],
) => {
	return getAllActions(actionGroup).filter((action) =>
		actions.some((ac) => actionGroup[ac] !== action),
	)
}

// const allButNoop = getAllActionsExcept(PanelLinksActions, ['noop'])
// console.log('allButNoop', allButNoop)

/*const getActionKeyByType = <
 TActionGroup extends ActionGroup,
 TAction extends TActionGroup[keyof TActionGroup],
 >(
 actionGroup: TActionGroup,
 action: TAction,
 ) => {
 return Object.keys(actionGroup).find((x) => actionGroup[x as keyof TActionGroup] === action)
 }*/

/*const acasdc = getAllActions(PanelsActions)
 console.log('actions', acasdc)
 const actins = getAllActionsExcept(PanelsActions, 'addManyPanels')
 console.log('actions', actins)*/
/*
 export const getAllActionFunctions = (actionGroup: ActionGroup) => {
 return getAllActions(actionGroup).map((action) => action as (...args: any[]) => any)
 }

 const fns = getAllActionFunctions(PanelsActions)
 const idk = fns[0]

 export const getAllActionNames = (actionGroup: ActionGroup) => {
 return getAllActions(actionGroup).map((action) => action.type)
 }

 export const getAllActionNamesAsStrings = (actionGroup: ActionGroup) => {
 return getAllActions(actionGroup).map((action) => action.type.toString())
 }
 */

/*
 export const getAllActionNamesAsStringsAndRemovePrefix = (actionGroup: ActionGroup) => {
 return getAllActions(actionGroup).map((action) => action.type.toString().replace('[App State Store] ', ''))
 }*/
