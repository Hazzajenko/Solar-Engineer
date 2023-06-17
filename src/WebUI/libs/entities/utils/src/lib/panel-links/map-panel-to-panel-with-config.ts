import { PanelConfigModel, PanelModel, PanelWithConfig } from '@entities/shared'

export const mapPanelToPanelWithConfig = (
	panel: PanelModel,
	panelConfig: PanelConfigModel,
): PanelWithConfig => {
	const {
		maximumPowerTemp,
		openCircuitVoltage,
		openCircuitVoltageTemp,
		shortCircuitCurrentTemp,
		voltageAtMaximumPower,
		shortCircuitCurrent,
		currentAtMaximumPower,
		maximumPower,
		weight,
		width,
		length,
	} = panelConfig
	return {
		id: panel.id,
		maximumPowerTemp,
		openCircuitVoltage,
		openCircuitVoltageTemp,
		shortCircuitCurrentTemp,
		voltageAtMaximumPower,
		shortCircuitCurrent,
		currentAtMaximumPower,
		maximumPower,
		weight,
		width,
		length,
	} as PanelWithConfig
}
