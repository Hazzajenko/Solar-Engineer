package strings

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

type String struct {
	ID           int64     `json:"id"`
	ProjectId    int64     `json:"projectId"`
	InverterId   int64     `json:"inverterId"`
	TrackerId    int64     `json:"trackerId"`
	Name         string    `json:"name"`
	CreatedAt    time.Time `json:"createdAt"`
	CreatedBy    int64     `json:"createdBy"`
	Version      int32     `json:"version"`
	IsInParallel bool      `json:"isInParallel"`
	PanelAmount  int64     `json:"panelAmount"`
}

type StringModel struct {
	DB *sql.DB
}

func (p *StringModel) Insert(string *String) (*String, error) {
	query := `
		INSERT INTO strings(
							project_id,
							inverter_id,
		                    tracker_id,
							name, 
							created_by, 
		                    is_in_parallel,
		                    panel_amount)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
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
	var result String
	args := []any{
		string.ProjectId,
		string.InverterId,
		string.TrackerId,
		string.Name,
		string.CreatedBy,
		string.IsInParallel,
		string.PanelAmount,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

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
		default:
			return nil, err
		}
	}

	return &result, nil
}

func (p *StringModel) GetStringsByProjectId(projectId int64) ([]*String, error) {
	query := `
		SELECT id, 
		       project_id, 
		       inverter_id, 
		       tracker_id, 
		       name, 
		       created_at, 
		       created_by,
		       is_in_parallel,
		       panel_amount, 
		       version FROM strings
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
	var strings []*String
	for rows.Next() {
		var stringModel String

		err := rows.Scan(
			&stringModel.ID,
			&stringModel.ProjectId,
			&stringModel.InverterId,
			&stringModel.TrackerId,
			&stringModel.Name,
			&stringModel.CreatedAt,
			&stringModel.CreatedBy,
			&stringModel.IsInParallel,
			&stringModel.PanelAmount,
			&stringModel.Version,
		)
		if err != nil {
			return nil, err
		}

		strings = append(strings, &stringModel)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return strings, nil
}

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
