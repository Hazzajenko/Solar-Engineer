package panels

import (
	"context"
	"database/sql"
	"github.com/shopspring/decimal"
	"time"
)

type Panel struct {
	ID                      int64           `json:"id"`
	ProjectId               int64           `json:"projectId"`
	InverterId              int64           `json:"inverterId"`
	TrackerId               int64           `json:"trackerId"`
	StringId                int64           `json:"stringId"`
	Name                    string          `json:"name"`
	Location                string          `json:"location"`
	CreatedAt               time.Time       `json:"createdAt"`
	CreatedBy               int64           `json:"createdBy"`
	CurrentAtMaximumPower   decimal.Decimal `json:"currentAtMaximumPower"`
	ShortCircuitCurrent     decimal.Decimal `json:"shortCircuitCurrent"`
	ShortCircuitCurrentTemp decimal.Decimal `json:"shortCircuitCurrentTemp"`
	MaximumPower            decimal.Decimal `json:"maximumPower"`
	MaximumPowerTemp        decimal.Decimal `json:"maximumPowerTemp"`
	VoltageAtMaximumPower   decimal.Decimal `json:"voltageAtMaximumPower"`
	OpenCircuitVoltage      decimal.Decimal `json:"openCircuitVoltage"`
	OpenCircuitVoltageTemp  decimal.Decimal `json:"openCircuitVoltageTemp"`
	Length                  int64           `json:"length"`
	Weight                  decimal.Decimal `json:"weight"`
	Width                   int64           `json:"width"`
	Version                 int             `json:"-"`
}

type PanelModel struct {
	DB *sql.DB
}

func (p *PanelModel) Insert(panel *Panel) (*Panel, error) {
	query := `
		INSERT INTO panels(
							project_id,
							inverter_id,
		                    tracker_id,
		                    string_id,
							name, 
							location,
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
							width)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
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
	var result Panel
	args := []any{
		panel.ProjectId,
		panel.InverterId,
		panel.TrackerId,
		panel.StringId,
		panel.Name,
		panel.Location,
		panel.CreatedBy,
		panel.CurrentAtMaximumPower,
		panel.ShortCircuitCurrent,
		panel.ShortCircuitCurrentTemp,
		panel.MaximumPower,
		panel.MaximumPowerTemp,
		panel.VoltageAtMaximumPower,
		panel.OpenCircuitVoltage,
		panel.OpenCircuitVoltageTemp,
		panel.Length,
		panel.Weight,
		panel.Width,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := p.DB.QueryRowContext(ctx, query, args...).Scan(
		&result.ID,
		&result.ProjectId,
		&result.InverterId,
		&result.TrackerId,
		&result.StringId,
		&result.Name,
		&result.Location,
		&result.CreatedAt,
		&result.CreatedBy,
		&result.CurrentAtMaximumPower,
		&result.ShortCircuitCurrent,
		&result.ShortCircuitCurrentTemp,
		&result.MaximumPower,
		&result.MaximumPowerTemp,
		&result.VoltageAtMaximumPower,
		&result.OpenCircuitVoltage,
		&result.OpenCircuitVoltageTemp,
		&result.Length,
		&result.Weight,
		&result.Width,
		&result.Version)
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	return &result, nil
}

func (p *PanelModel) GetPanelsByProjectId(projectId int64) ([]*Panel, error) {
	query := `
		SELECT id, 
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
		       version FROM panels
		WHERE project_id = $1
		`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := p.DB.QueryContext(ctx, query, projectId)
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	defer rows.Close()
	var panels []*Panel
	for rows.Next() {
		var panel Panel

		err := rows.Scan(
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
			return nil, err
		}

		panels = append(panels, &panel)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return panels, nil
}
