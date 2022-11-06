package trackers

import (
	"context"
	"database/sql"
	"time"
)

type Tracker struct {
	ID                     int64     `json:"id"`
	ProjectId              int64     `json:"projectId"`
	InverterId             int64     `json:"inverterId"`
	Name                   string    `json:"name"`
	CreatedAt              time.Time `json:"createdAt"`
	CreatedBy              int64     `json:"createdBy"`
	Version                int       `json:"-"`
	MaxInputCurrent        int       `json:"maxShortCircuitCurrent"`
	MaxShortCircuitCurrent int       `json:"acOutputCurrent"`
	StringAmount           int       `json:"europeanEfficiency"`
	ParallelAmount         int       `json:"maxInputCurrent"`
	PanelAmount            int       `json:"maxOutputPower"`
}

type TrackerModel struct {
	DB *sql.DB
}

func (p *TrackerModel) Insert(tracker *Tracker) (*Tracker, error) {
	query := `
		INSERT INTO trackers(
							project_id,
							inverter_id,
							name, 
							created_by, 
							max_input_current,
							max_short_circuit_current)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING  id, 
		    project_id, 
		    inverter_id,
		    name, 
		    created_at, 
		    created_by, 
			max_input_current,
			max_short_circuit_current, 
			string_amount, 
			parallel_amount, 
			panel_amount, 
			version`
	var result Tracker
	args := []any{
		tracker.ProjectId,
		tracker.InverterId,
		tracker.Name,
		tracker.CreatedBy,
		tracker.MaxInputCurrent,
		tracker.MaxShortCircuitCurrent,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := p.DB.QueryRowContext(ctx, query, args...).Scan(
		&result.ID,
		&result.ProjectId,
		&result.InverterId,
		&result.Name,
		&result.CreatedAt,
		&result.CreatedBy,
		&result.MaxInputCurrent,
		&result.MaxShortCircuitCurrent,
		&result.StringAmount,
		&result.ParallelAmount,
		&result.PanelAmount,
		&result.Version)
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	return &result, nil
}

func (p *TrackerModel) GetTrackersByProjectId(projectId int64) ([]*Tracker, error) {
	query := `
		SELECT id, 
		       project_id, 
		       inverter_id, 
		       name, 
		       created_at, 
		       created_by,
		       max_input_current,
		       max_short_circuit_current, 
		       string_amount, 
		       parallel_amount, 
		       panel_amount, 
		       version FROM trackers
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
	var trackers []*Tracker
	for rows.Next() {
		var tracker Tracker

		err := rows.Scan(
			&tracker.ID,
			&tracker.ProjectId,
			&tracker.InverterId,
			&tracker.Name,
			&tracker.CreatedAt,
			&tracker.CreatedBy,
			&tracker.MaxInputCurrent,
			&tracker.MaxShortCircuitCurrent,
			&tracker.StringAmount,
			&tracker.ParallelAmount,
			&tracker.PanelAmount,
			&tracker.Version,
		)
		if err != nil {
			return nil, err
		}

		trackers = append(trackers, &tracker)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return trackers, nil
}

func (p *TrackerModel) GetTrackersByInverterId(inverterId int64) ([]*Tracker, error) {
	query := `
		SELECT id, 
		       project_id, 
		       inverter_id, 
		       name, 
		       created_at, 
		       created_by,
		       max_input_current,
		       max_short_circuit_current, 
		       string_amount, 
		       parallel_amount, 
		       panel_amount, 
		       version FROM trackers
		WHERE inverter_id = $1
		`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := p.DB.QueryContext(ctx, query, inverterId)
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	defer rows.Close()
	var trackers []*Tracker
	for rows.Next() {
		var tracker Tracker

		err := rows.Scan(
			&tracker.ID,
			&tracker.ProjectId,
			&tracker.InverterId,
			&tracker.Name,
			&tracker.CreatedAt,
			&tracker.CreatedBy,
			&tracker.MaxInputCurrent,
			&tracker.MaxShortCircuitCurrent,
			&tracker.StringAmount,
			&tracker.ParallelAmount,
			&tracker.PanelAmount,
			&tracker.Version,
		)
		if err != nil {
			return nil, err
		}

		trackers = append(trackers, &tracker)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return trackers, nil
}
