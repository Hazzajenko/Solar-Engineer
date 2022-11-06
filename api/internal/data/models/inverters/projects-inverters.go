package inverters

import (
	"context"
	"time"
)

type ProjectInverter struct {
	ProjectId  int64 `json:"projectId"`
	InverterId int64 `json:"inverterId"`
}

func (p *InverterModel) InsertProjectInverter(projectInverter *ProjectInverter) error {
	query := `
		INSERT INTO projects_inverters(project_id, inverter_id)
		VALUES ($1, $2)`

	args := []any{projectInverter.ProjectId, projectInverter.InverterId}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := p.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		default:
			return err
		}
	}
	return nil
	/*	var result ProjectInverter
		err := p.DB.QueryRowContext(ctx, query, args...).Scan(
			&result.ProjectId,
			&result.InverterId)
		if err != nil {
			switch {
			default:
				return nil, err
			}
		}

		return &result, nil*/
}
