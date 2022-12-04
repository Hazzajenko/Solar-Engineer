package rails

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"time"
)

type RailModel struct {
	DB *sql.DB
}

func (p *RailModel) Create(rail *boiler.Rail) (*boiler.Rail, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := rail.Insert(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	return rail, nil
}

func (p *RailModel) CreateMany(rails []boiler.Rail) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	for _, rail := range rails {
		err := rail.Insert(ctx, p.DB, boil.Infer())
		if err != nil {
			switch {
			default:
				return err
			}
		}
	}

	return nil
}

func (p *RailModel) GetRailByProjectId(projectId int64) (*boiler.RailSlice, error) {
	if projectId < 1 {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	rails, err := boiler.Rails(boiler.RailWhere.ProjectID.EQ(projectId)).All(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("record not found")
		default:
			return nil, err
		}
	}

	return &rails, nil
}

func (p *RailModel) Update(update *boiler.Rail) (*boiler.Rail, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	rail, err := boiler.FindRail(ctx, p.DB, update.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	rail.Location = update.Location

	_, err = rail.Update(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	return rail, nil
}

func (p *RailModel) Delete(railId string) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rail, err := boiler.FindRail(ctx, p.DB, railId)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	_, err = rail.Delete(ctx, p.DB)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	return nil
}
