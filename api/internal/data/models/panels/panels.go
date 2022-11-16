package panels

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
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
	Model                   int             `json:"model"`
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
	Color                   string          `json:"color"`
	Version                 int32           `json:"version"`
}

type PanelModel struct {
	DB *sql.DB
}

func (p *PanelModel) CheckIfLocationIsFree(location string) (*Panel, error) {
	query := `
			SELECT id, name, location, version
			FROM panels
			WHERE location = $1
			`
	var panel Panel
	//args := []any{project.Name, project.CreatedBy}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := p.DB.QueryRowContext(ctx, query, location).Scan(
		&panel.ID,
		&panel.Name,
		&panel.Location,
		&panel.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, nil
		default:
			return nil, err
		}
	}

	return &panel, nil
	/*	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()
		panel, err := boiler.Panels(boiler.PanelWhere.Location.EQ(location)).All(ctx, p.DB)
		if err != nil {
			switch {
			case errors.Is(err, sql.ErrNoRows):
				return false, errors.New("record not found")
			default:
				return false, err
			}
		}
		if panel == nil {
			return false, err
		}

		return true, nil*/
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
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
		RETURNING  id, 
		    project_id, 
		    inverter_id,
		    tracker_id,
		    string_id,
		    name,
		    model,
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
		&result.Model,
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

func (p *PanelModel) GetPanelsByProjectId(projectId int64) (*boiler.PanelSlice, error) {
	if projectId < 1 {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	panels, err := boiler.Panels(boiler.PanelWhere.ProjectID.EQ(projectId)).All(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("record not found")
		default:
			return nil, err
		}
	}

	return &panels, nil
}
