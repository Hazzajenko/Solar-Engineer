export type PanelConfig = {
	id: PanelConfigId
	brand?: string
	model?: string
	name: string
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
}

export type PanelConfigId = string & {
	readonly _type: 'panelConfigId'
}
