package joins

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"time"
)

type JoinModel struct {
	DB *sql.DB
}

func (p *JoinModel) Create(join *boiler.Join) (*boiler.Join, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := join.Insert(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	return join, nil
}

func (p *JoinModel) GetJoinsByProjectId(projectId int64) (*boiler.JoinSlice, error) {
	if projectId < 1 {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	joins, err := boiler.Joins(boiler.JoinWhere.ProjectID.EQ(projectId)).All(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("record not found")
		default:
			return nil, err
		}
	}

	return &joins, nil
}

func (p *JoinModel) Update(update *boiler.Join) (*boiler.Join, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	join, err := boiler.FindJoin(ctx, p.DB, update.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	join.Color = update.Color
	join.Size = update.Size

	_, err = join.Update(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	return join, nil
}

func (p *JoinModel) Delete(joinId string) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	cable, err := boiler.FindCable(ctx, p.DB, joinId)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	_, err = cable.Delete(ctx, p.DB)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	return nil
}
