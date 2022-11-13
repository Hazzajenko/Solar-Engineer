package projects

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"time"
)

type Project struct {
	ID             int64     `json:"id"`
	Name           string    `json:"name"`
	CreatedAt      time.Time `json:"createdAt"`
	CreatedBy      int64     `json:"createdBy"`
	Version        int       `json:"-"`
	InverterAmount int       `json:"inverterAmount"`
}

type ProjectModel struct {
	DB *sql.DB
}

func (p *ProjectModel) Insert(project *Project) (*Project, error) {
	query := `
		INSERT INTO projects(name, created_by)
		VALUES ($1, $2)
		RETURNING  id, created_at, version`
	var result Project
	args := []any{project.Name, project.CreatedBy}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := p.DB.QueryRowContext(ctx, query, args...).Scan(
		&result.ID,
		&result.CreatedAt,
		&result.Version)
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	return &result, nil
}

func (p *ProjectModel) GetAll() ([]*Project, error) {
	query := `
		SELECT id, name, created_at, created_by, inverter_amount, version 
		FROM projects
		`

	//args := []any{project.Name, project.CreatedBy}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := p.DB.QueryContext(ctx, query)
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	defer rows.Close()
	var projects []*Project
	for rows.Next() {
		var project Project

		err := rows.Scan(
			&project.ID,
			&project.Name,
			&project.CreatedAt,
			&project.CreatedBy,
			&project.InverterAmount,
			&project.Version,
		)
		if err != nil {
			return nil, err
		}

		projects = append(projects, &project)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return projects, nil
}

func (p *ProjectModel) Get(projectId int64) (*boiler.Project, error) {
	if projectId < 1 {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	project, err := boiler.FindProject(ctx, p.DB, projectId)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("record not found")
		default:
			return nil, err
		}
	}

	return project, nil
}
