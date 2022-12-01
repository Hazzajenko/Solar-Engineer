package trays

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"time"
)

type TrayModel struct {
	DB *sql.DB
}

func (p *TrayModel) Create(tray *boiler.Tray) (*boiler.Tray, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := tray.Insert(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	return tray, nil
}

func (p *TrayModel) GetTrayByProjectId(projectId int64) (*boiler.TraySlice, error) {
	if projectId < 1 {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	trays, err := boiler.Trays(boiler.TrayWhere.ProjectID.EQ(projectId)).All(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("record not found")
		default:
			return nil, err
		}
	}

	return &trays, nil
}

func (p *TrayModel) Update(update *boiler.Tray) (*boiler.Tray, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	tray, err := boiler.FindTray(ctx, p.DB, update.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	tray.Color = update.Color
	tray.Location = update.Color
	tray.Size = update.Size

	_, err = tray.Update(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	return tray, nil
}

func (p *TrayModel) Delete(trayId string) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	cable, err := boiler.FindTray(ctx, p.DB, trayId)
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
