import { createActionGroup } from '@ngrx/store'

export type ActionGroup = ReturnType<typeof createActionGroup>

export const getAllActions = (actionGroup: ActionGroup) => {
	return Object.keys(actionGroup).map((key) => actionGroup[key as keyof typeof actionGroup])
}
