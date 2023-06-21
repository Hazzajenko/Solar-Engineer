import { ENTITY_TYPE } from '../common'
import { z } from 'zod'

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

export const PANEL_CONFIG_MODEL = z.object({
	id: z.string(),
	brand: z.string().optional(),
	model: z.string().optional(),
	default: z.boolean().optional(),
	fullName: z.string(),
	currentAtMaximumPower: z.number(),
	shortCircuitCurrent: z.number(),
	shortCircuitCurrentTemp: z.number(),
	maximumPower: z.number(),
	maximumPowerTemp: z.number(),
	voltageAtMaximumPower: z.number(),
	openCircuitVoltage: z.number(),
	openCircuitVoltageTemp: z.number(),
	length: z.number(),
	width: z.number(),
	weight: z.number(),
	type: z.literal(ENTITY_TYPE.PANEL_CONFIG),
})

export type PanelConfigId = string & {
	readonly _type: 'panelConfigId'
}

// export const UndefinedPanelConfigId = 'undefinedPanelConfigId' as PanelConfigId

export const DEFAULT_PANEL_CONFIG_ID = 'Longi-Himo555m' as PanelConfigId
