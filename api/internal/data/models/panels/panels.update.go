package panels

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/volatiletech/sqlboiler/v4/boil"
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
		    color,
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
		&panel.Color,
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

func (p *PanelModel) UpdatePanel(update *boiler.Panel) (*boiler.Panel, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	panel, err := boiler.Panels(boiler.PanelWhere.ID.EQ(update.ID)).One(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}
	//panel.Color = update.Color
	panel.Location = update.Location
	panel.StringID = update.StringID
	panel.TrackerID = update.TrackerID
	panel.PositiveToID = update.PositiveToID
	panel.NegativeToID = update.NegativeToID
	/*	panel.AddPositivePanelJoins()*/
	_, err = panel.Update(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}
	//fmt.Println(panelRowsAff)

	//result, err := boiler.Panels(boiler.PanelWhere.StringID.EQ(stringId)).All(ctx, p.DB)
	return panel, nil
}

func (p *PanelModel) UpdatePanelsColor(stringId string, stringColor string) (boiler.PanelSlice, int64, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	panels, err := boiler.Panels(boiler.PanelWhere.StringID.EQ(stringId)).All(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, 0, errors.New("edit conflict")
		default:
			return nil, 0, err
		}
	}
	panelRowsAff, err := panels.UpdateAll(ctx, p.DB, boiler.M{"color": stringColor})
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, 0, errors.New("edit conflict")
		default:
			return nil, 0, err
		}
	}
	//fmt.Println(panelRowsAff)

	result, err := boiler.Panels(boiler.PanelWhere.StringID.EQ(stringId)).All(ctx, p.DB)
	return result, panelRowsAff, nil
}
