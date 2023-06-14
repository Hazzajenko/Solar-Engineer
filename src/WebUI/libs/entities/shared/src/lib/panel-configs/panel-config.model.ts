import { ENTITY_TYPE } from '../common'

export type PanelConfigModel = {
	id: PanelConfigId
	brand?: string
	model?: string
	default?: boolean
	fullName: string
	currentAtMaximumPower: number
	shortCircuitCurrent: number
	shortCircuitCurrentTemp: number
	maximumPower: number
	maximumPowerTemp: number
	voltageAtMaximumPower: number
	openCircuitVoltage: number
	openCircuitVoltageTemp: number
	length: number
	width: number
	weight: number
	type: typeof ENTITY_TYPE.PANEL_CONFIG
}

export type PanelConfigId = string & {
	readonly _type: 'panelConfigId'
}

// export const UndefinedPanelConfigId = 'undefinedPanelConfigId' as PanelConfigId

export const DEFAULT_PANEL_CONFIG_ID = 'Longi-Himo555m' as PanelConfigId
