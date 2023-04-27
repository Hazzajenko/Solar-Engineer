export const STRING_SELECTED = {
	NOT_SELECTED: 'NotSelected',
	SINGLE_SELECTED: 'Selected',
	OTHER_SELECTED: 'OtherSelected',
} as const

export type StringSelected = (typeof STRING_SELECTED)[keyof typeof STRING_SELECTED]

/*
 export enum StringSelectedVal {
 NOT_SELECTED,
 SELECTED,
 OTHER_SELECTED,
 }
 */
