package panels

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

func (p *PanelModel) UpdatePanelLocation(panel *Panel) (*Panel, error) {
	query := `
		UPDATE panels
		SET inverter_id = $1, tracker_id = $2, string_id = $3, location = $4, version = version + 1
		WHERE id = $5 AND version = $6
		RETURNING  id, 
			project_id, 
			inverter_id, 
			tracker_id, 
			string_id, 
			name,
			location,
			created_at, 				
			created_by, 			
			current_at_maximum_power, 				
			short_circuit_current, 				
			short_circuit_current_temp, 					
			maximum_power,				
			maximum_power_temp, 				
			voltage_at_maximum_power, 				
			open_circuit_voltage, 				
			open_circuit_voltage_temp, 							
			length, 								
			weight, 				
			width,
			version`
	args := []any{
		panel.InverterId,
		panel.TrackerId,
		panel.StringId,
		panel.Location,
		panel.ID,
		panel.Version,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	//var result Panel

	err := p.DB.QueryRowContext(ctx, query, args...).Scan(
		&panel.ID,
		&panel.ProjectId,
		&panel.InverterId,
		&panel.TrackerId,
		&panel.StringId,
		&panel.Name,
		&panel.Location,
		&panel.CreatedAt,
		&panel.CreatedBy,
		&panel.CurrentAtMaximumPower,
		&panel.ShortCircuitCurrent,
		&panel.ShortCircuitCurrentTemp,
		&panel.MaximumPower,
		&panel.MaximumPowerTemp,
		&panel.VoltageAtMaximumPower,
		&panel.OpenCircuitVoltage,
		&panel.OpenCircuitVoltageTemp,
		&panel.Length,
		&panel.Weight,
		&panel.Width,
		&panel.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	return panel, nil
}
