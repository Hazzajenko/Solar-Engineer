package panel_joins

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"time"
)

type PanelJoinModel struct {
	DB *sql.DB
}

func (p *PanelJoinModel) GetById(positiveID string, negativeID string) (*boiler.PanelJoin, error) {
	if positiveID == "" {
		return nil, errors.New("record not found")
	}

	if negativeID == "" {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	panelJoin, err := boiler.FindPanelJoin(ctx, p.DB, positiveID, negativeID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	return panelJoin, nil
}

func (p *PanelJoinModel) Create(panelJoin *boiler.PanelJoin) (*boiler.PanelJoin, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := panelJoin.Insert(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	return panelJoin, nil
}

func (p *PanelJoinModel) GetPanelJoinsByProjectId(projectId int64) (*boiler.PanelJoinSlice, error) {
	if projectId < 1 {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	panelJoins, err := boiler.PanelJoins(boiler.PanelJoinWhere.ProjectID.EQ(projectId)).All(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("record not found")
		default:
			return nil, err
		}
	}

	return &panelJoins, nil
}
