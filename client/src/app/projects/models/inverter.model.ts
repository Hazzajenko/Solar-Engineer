import { UnitModel } from "./unit.model";

export interface InverterModel {
	id: number;
	project_id: number;
	model?: UnitModel;
	name: string;
	brand: string;
	created_by: number;
	created_at: string;
	tracker_amount: number;
	parallel_amount: number;
	string_amount: number;
	panel_amount: number;
	ac_nominal_output: number;
	ac_output_current: number;
	european_efficiency: number;
	max_input_current: number;
	max_output_power: number;
	mpp_voltage_range_low: number;
	mpp_voltage_range_high: number;
	start_up_voltage: number;
}
