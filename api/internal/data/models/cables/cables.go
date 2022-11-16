package cables

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"time"
)

type CableModel struct {
	DB *sql.DB
}

func (p *CableModel) Create(cable *boiler.Cable) (*boiler.Cable, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := cable.Insert(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	return cable, nil
}

func (p *CableModel) GetCablesByProjectId(projectId int64) (*boiler.CableSlice, error) {
	if projectId < 1 {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	cables, err := boiler.Cables(boiler.CableWhere.ProjectID.EQ(projectId)).All(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("record not found")
		default:
			return nil, err
		}
	}

	return &cables, nil
}

func (p *CableModel) Update(cable *boiler.Cable) (*boiler.Cable, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	existing, err := boiler.FindCable(ctx, p.DB, cable.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	// Update code here
	existing.Location = cable.Location
	existing.Color = cable.Color
	existing.Size = cable.Size

	_, err = existing.Update(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	return cable, nil
}

func (p *CableModel) Delete(cableId int64) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	cable, err := boiler.FindCable(ctx, p.DB, cableId)
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
