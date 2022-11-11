package strings

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

func (p *StringModel) UpdateString(string *String) (*String, error) {
	query := `
		UPDATE strings
		SET name = $1, is_in_parallel = $2, panel_amount = $3, inverter_id = $4, tracker_id = $5, version = version + 1
		WHERE id = $6 AND version = $7
		RETURNING  id, 
		    project_id, 
		    inverter_id,
		    tracker_id,
		    name, 
		    created_at, 
		    created_by, 
			is_in_parallel, 
			panel_amount, 
			version`
	args := []any{
		string.Name,
		string.IsInParallel,
		string.PanelAmount,
		string.InverterId,
		string.TrackerId,
		string.ID,
		string.Version,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var result String

	err := p.DB.QueryRowContext(ctx, query, args...).Scan(
		&result.ID,
		&result.ProjectId,
		&result.InverterId,
		&result.TrackerId,
		&result.Name,
		&result.CreatedAt,
		&result.CreatedBy,
		&result.IsInParallel,
		&result.PanelAmount,
		&result.Version)
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

func (p *StringModel) UpdatePanelAmount(string *String) (*String, error) {
	query := `
		UPDATE strings
		SET panel_amount = $1, version = version + 1
		WHERE id = $2 AND version = $3
		RETURNING  id, 
		    project_id, 
		    inverter_id,
		    tracker_id,
		    name, 
		    created_at, 
		    created_by, 
			is_in_parallel, 
			panel_amount, 
			version`
	args := []any{
		string.PanelAmount,
		string.ID,
		string.Version,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var result String

	err := p.DB.QueryRowContext(ctx, query, args...).Scan(
		&result.ID,
		&result.ProjectId,
		&result.InverterId,
		&result.TrackerId,
		&result.Name,
		&result.CreatedAt,
		&result.CreatedBy,
		&result.IsInParallel,
		&result.PanelAmount,
		&result.Version)
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
