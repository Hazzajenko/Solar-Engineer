package inverters

import (
	"context"
	"database/sql"
	"time"
)

type Inverter struct {
	ID                  int64     `json:"id"`
	ProjectId           int64     `json:"project_id"`
	Name                string    `json:"name"`
	CreatedAt           time.Time `json:"created_at"`
	CreatedBy           int64     `json:"created_by"`
	Version             int       `json:"-"`
	TrackerAmount       int       `json:"tracker_amount"`
	AcNominalOutput     int       `json:"ac_nominal_output"`
	AcOutputCurrent     int       `json:"ac_output_current"`
	EuropeanEfficiency  int       `json:"european_efficiency"`
	MaxInputCurrent     int       `json:"max_input_current"`
	MaxOutputPower      int       `json:"max_output_power"`
	MppVoltageRangeLow  int       `json:"mpp_voltage_range_low"`
	MppVoltageRangeHigh int       `json:"mpp_voltage_range_high"`
	StartUpVoltage      int       `json:"start_up_voltage"`
}

type InverterModel struct {
	DB *sql.DB
}

func (p *InverterModel) Insert(inverter *Inverter) (*Inverter, error) {
	query := `
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

	return &result, nil
}

func (p *InverterModel) GetInvertersByProjectId(projectId int64) ([]*Inverter, error) {
	query := `
		SELECT id, project_id, name, created_at, created_by, tracker_amount, ac_nominal_output, version FROM inverters
		WHERE project_id = $1
		`

	//args := []any{project.Name, project.CreatedBy}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	/*	for rows.Next() {
		var project Project

		err := rows.Scan(
			//&totalRecords,
			&project.ID,
			&project.Name,
			&project.CreatedAt,
			//&project.CreatedBy,
			&project.InverterAmount,
			//pq.Array(&movie.Genres),
			&project.Version,
		)
		if err != nil {
			return nil, err
		}

		projects = append(projects, &project)
	}*/

	rows, err := p.DB.QueryContext(ctx, query, projectId)
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}
	/*	rows, err := p.DB.QueryContext(ctx, query, projectId).Scan(
		&inverters.ID,
		&movie.CreatedAt,
		&movie.Title,
		&movie.Year,
		&movie.Runtime,
		pq.Array(&movie.Genres),
		&movie.Version,
	)*/

	defer rows.Close()
	var inverters []*Inverter
	for rows.Next() {
		var inverter Inverter

		err := rows.Scan(
			//&totalRecords,
			&inverter.ID,
			&inverter.ProjectId,
			&inverter.Name,
			&inverter.CreatedAt,
			&inverter.CreatedBy,
			&inverter.TrackerAmount,
			&inverter.AcNominalOutput,
			//pq.Array(&movie.Genres),
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

	return inverters, nil
}
