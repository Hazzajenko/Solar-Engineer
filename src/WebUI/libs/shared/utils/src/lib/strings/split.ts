import { Action } from '@shared/types'

type TSVersion = '4.1.2'

type ExtractSemver<SemverString extends string> =
	SemverString extends `${infer Major}.${infer Minor}.${infer Patch}`
		? {
				major: Major
				minor: Minor
				patch: Patch
		  }
		: {
				error: 'Cannot parse semver string'
		  }

type TS = ExtractSemver<TSVersion>

type BadSemverButOKString = ExtractSemver<'4.0.Four.4444'>

type SemverError = ExtractSemver<'Four point Zero point Five'>

export type Split<S extends string, D extends string> = string extends S
	? string[]
	: S extends ''
	? []
	: S extends `${infer T}${D}${infer U}`
	? [T, ...Split<U, D>]
	: [S]

type S1 = Split<string, '.'>

type S2 = Split<'', '.'>

type S3 = Split<'1.2', '.'>

type S4 = Split<'1.2.3', '.'>

type Store = 'Panels' | 'Panel Links' | 'Panel Configs'
type StoreOneOf = 'Panel' | 'Panels' | 'Panel Link' | 'Panel Config'
// type Stores = 'Panels Store' | 'Panel Links Store' | 'Panel Configs Store'

type StoreAction = 'Add' | 'Add Many' | 'Update' | 'Update Many' | 'Delete' | 'Delete Many'

type AllLocaleIDs = `<${Store} Store> ${StoreAction} ${StoreOneOf}`

type ActionSplit<SemverString extends string> =
	SemverString extends `[${Store} Store] ${StoreAction} ${StoreOneOf}`
		? {
				major: Store
				minor: StoreAction
				patch: StoreOneOf
		  }
		: {
				error: 'Cannot parse semver string'
		  }

type ActionSplit2<SemverString extends Action> =
	SemverString['type'] extends `[${Store} Store] ${StoreAction} ${StoreOneOf}`
		? {
				major: Store
				minor: StoreAction
				patch: StoreOneOf
		  }
		: {
				error: 'Cannot parse semver string'
		  }

//
// const testAcc: typeof PanelsActions.addPanel = {} as typeof PanelsActions.addPanel
// // const testAcc: ReturnType<typeof PanelsActions.addPanel>
// const stringyyy =  testAcc.type.toString() as typeof PanelsActions.addPanel['type']
// type teSADASD = ActionSplit<typeof PanelsActions.addPanel['type']>
// const fkk: teSADASD
// fkk.major
//
// const fkk2: ActionSplit<typeof PanelsActions.addManyPanels['type']>
//
// const fkk3: ActionSplit2<typeof PanelsActions.updatePanel>
// fkk3.
