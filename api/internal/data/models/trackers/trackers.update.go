package trackers

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

func (p *TrackerModel) UpdateStringAmount(tracker *Tracker) (*Tracker, error) {
	query := `
		UPDATE trackers
		SET string_amount = $1, version = version + 1
		WHERE id = $2 AND version = $3
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
	args := []any{
		tracker.StringAmount,
		tracker.ID,
		tracker.Version,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var result Tracker

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
		&result.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	return &result, nil
}
