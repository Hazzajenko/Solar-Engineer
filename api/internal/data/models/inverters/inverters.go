package inverters

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"time"
)

type Inverter struct {
	ID                  int64     `json:"id"`
	ProjectId           int64     `json:"projectId"`
	Name                string    `json:"name"`
	CreatedAt           time.Time `json:"createdAt"`
	CreatedBy           int64     `json:"createdBy"`
	Model               int       `json:"model"`
	Version             int       `json:"version"`
	TrackerAmount       int       `json:"trackerAmount"`
	AcNominalOutput     int       `json:"acNominalOutput"`
	AcOutputCurrent     int       `json:"acOutputCurrent"`
	EuropeanEfficiency  int       `json:"europeanEfficiency"`
	MaxInputCurrent     int       `json:"maxInputCurrent"`
	MaxOutputPower      int       `json:"maxOutputPower"`
	MppVoltageRangeLow  int       `json:"mppVoltageRangeLow"`
	MppVoltageRangeHigh int       `json:"mppVoltageRangeHigh"`
	StartUpVoltage      int       `json:"startUpVoltage"`
}

type InverterModel struct {
	DB *sql.DB
}

func (p *InverterModel) Insert(inverter *boiler.Inverter) (*boiler.Inverter, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := inverter.Insert(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	return inverter, nil
	/*	query := `
			INSERT INTO inverters(
			                      project_id,
			                      name,
			                      created_by,
			                      tracker_amount,
			                      ac_nominal_output,
			                      ac_output_current,
			                      european_efficiency,
			                      max_input_current,
			                      max_output_power,
			                      mpp_voltage_range_low,
			                      mpp_voltage_range_high,
			                      start_up_voltage)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
			RETURNING  id,
			    project_id,
			    name,
			    model,
			    created_at,
			    created_by,
				tracker_amount,
				ac_nominal_output,
				ac_output_current,
				european_efficiency,
				max_input_current,
				max_output_power,
				mpp_voltage_range_low,
				mpp_voltage_range_high,
				start_up_voltage,
			    version`
		var result Inverter
		args := []any{
			inverter.ProjectId,
			inverter.Name,
			inverter.CreatedBy,
			inverter.TrackerAmount,
			inverter.AcNominalOutput,
			inverter.AcOutputCurrent,
			inverter.EuropeanEfficiency,
			inverter.MaxInputCurrent,
			inverter.MaxOutputPower,
			inverter.MppVoltageRangeLow,
			inverter.MppVoltageRangeHigh,
			inverter.StartUpVoltage,
		}
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()

		err := p.DB.QueryRowContext(ctx, query, args...).Scan(
			&result.ID,
			&result.ProjectId,
			&result.Name,
			&result.Model,
			&result.CreatedAt,
			&result.CreatedBy,
			&result.TrackerAmount,
			&result.AcNominalOutput,
			&result.AcOutputCurrent,
			&result.EuropeanEfficiency,
			&result.MaxInputCurrent,
			&result.MaxOutputPower,
			&result.MppVoltageRangeLow,
			&result.MppVoltageRangeHigh,
			&result.StartUpVoltage,
			&result.Version)
		if err != nil {
			switch {
			default:
				return nil, err
			}
		}

		return &result, nil*/
}

func (p *InverterModel) UpdateInverter(request *boiler.Inverter) (*boiler.Inverter, error) {
	// Find a pilot and update his name
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	inverter, err := boiler.FindInverter(ctx, p.DB, request.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}
	inverter.Location = request.Location
	inverter.Name = request.Name
	inverter.Color = request.Color

	_, err = inverter.Update(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	return inverter, nil
}

func (p *InverterModel) GetInvertersByProjectId(projectId int64) (*boiler.InverterSlice, error) {
	if projectId < 1 {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	inverters, err := boiler.Inverters(boiler.InverterWhere.ProjectID.EQ(projectId)).All(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("record not found")
		default:
			return nil, err
		}
	}

	return &inverters, nil
	/*	query := `
			SELECT
				id,
			    project_id,
			    name,
			    model,
			    created_at,
			    created_by,
				tracker_amount,
				ac_nominal_output,
				ac_output_current,
				european_efficiency,
				max_input_current,
				max_output_power,
				mpp_voltage_range_low,
				mpp_voltage_range_high,
				start_up_voltage,
			    version
			FROM inverters
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
		var inverters []*Inverter
		for rows.Next() {
			var inverter Inverter

			err := rows.Scan(
				&inverter.ID,
				&inverter.ProjectId,
				&inverter.Name,
				&inverter.Model,
				&inverter.CreatedAt,
				&inverter.CreatedBy,
				&inverter.TrackerAmount,
				&inverter.AcNominalOutput,
				&inverter.AcOutputCurrent,
				&inverter.EuropeanEfficiency,
				&inverter.MaxInputCurrent,
				&inverter.MaxOutputPower,
				&inverter.MppVoltageRangeLow,
				&inverter.MppVoltageRangeHigh,
				&inverter.StartUpVoltage,
				&inverter.Version,
			)
			if err != nil {
				return nil, err
			}

			inverters = append(inverters, &inverter)
		}

		if err = rows.Err(); err != nil {
			return nil, err
		}

		return inverters, nil*/
}
