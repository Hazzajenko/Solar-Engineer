package strings

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"time"
)

type String struct {
	ID           int64     `json:"id"`
	ProjectId    int64     `json:"projectId"`
	InverterId   int64     `json:"inverterId"`
	TrackerId    int64     `json:"trackerId"`
	Name         string    `json:"name"`
	Model        int       `json:"model"`
	CreatedAt    time.Time `json:"createdAt"`
	CreatedBy    int64     `json:"createdBy"`
	Version      int32     `json:"version"`
	IsInParallel bool      `json:"isInParallel"`
	PanelAmount  int64     `json:"panelAmount"`
}

type StringModel struct {
	DB *sql.DB
}

func (p *StringModel) Insert(string *boiler.String) (*boiler.String, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := string.Insert(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	return string, nil
}

func (p *StringModel) Get(stringId int64) (*String, error) {
	if stringId < 1 {
		return nil, errors.New("record not found")
	}

	query := `
		SELECT id, 
		       project_id, 
		       inverter_id, 
		       tracker_id, 
		       name, 
		       model,
		       created_at, 
		       created_by,
		       is_in_parallel,
		       panel_amount, 
		       version FROM strings
		WHERE id = $1
		`
	var stringModel String
	//args := []any{project.Name, project.CreatedBy}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := p.DB.QueryRowContext(ctx, query, stringId).Scan(
		&stringModel.ID,
		&stringModel.ProjectId,
		&stringModel.InverterId,
		&stringModel.TrackerId,
		&stringModel.Name,
		&stringModel.Model,
		&stringModel.CreatedAt,
		&stringModel.CreatedBy,
		&stringModel.IsInParallel,
		&stringModel.PanelAmount,
		&stringModel.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("record not found")
		default:
			return nil, err
		}
	}

	return &stringModel, nil
}

func (p *StringModel) GetStringsByProjectId(projectId int64) (*boiler.StringSlice, error) {
	if projectId < 1 {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	strings, err := boiler.Strings(boiler.StringWhere.ProjectID.EQ(projectId)).All(ctx, p.DB)
	//project, err := boiler.Projects().One(ctx, p.DB)
	//strings, err := project.Strings().All(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("record not found")
		default:
			return nil, err
		}
	}

	return &strings, nil
	/*	query := `
			SELECT id,
			       project_id,
			       inverter_id,
			       tracker_id,
			       name,
			       model,
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
				&stringModel.Model,
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

		return strings, nil*/
}
