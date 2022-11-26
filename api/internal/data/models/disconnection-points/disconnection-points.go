package disconnection_points

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"time"
)

type DisconnectionPointModel struct {
	DB *sql.DB
}

func (p *DisconnectionPointModel) GetById(disconnectionPointId string) (*boiler.DisconnectionPoint, error) {
	if disconnectionPointId == "" {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	disconnectionPoint, err := boiler.FindDisconnectionPoint(ctx, p.DB, disconnectionPointId)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	return disconnectionPoint, nil
}

func (p *DisconnectionPointModel) Create(disconnectionPoint *boiler.DisconnectionPoint) (*boiler.DisconnectionPoint, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := disconnectionPoint.Insert(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	return disconnectionPoint, nil
}

func (p *DisconnectionPointModel) GetByProjectID(projectId int64) (*boiler.DisconnectionPointSlice, error) {
	if projectId < 1 {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	disconnectionPoints, err := boiler.DisconnectionPoints(boiler.DisconnectionPointWhere.ProjectID.EQ(projectId)).All(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("record not found")
		default:
			return nil, err
		}
	}

	return &disconnectionPoints, nil
}

func (p *DisconnectionPointModel) Update(update *boiler.DisconnectionPoint) (*boiler.DisconnectionPoint, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	disconnectionPoint, err := boiler.DisconnectionPoints(boiler.DisconnectionPointWhere.ID.EQ(update.ID)).One(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}
	//panel.Color = update.Color
	disconnectionPoint.Location = update.Location
	disconnectionPoint.StringID = update.StringID
	//panel.TrackerID = update.TrackerID
	disconnectionPoint.PositiveID = update.PositiveID
	disconnectionPoint.NegativeID = update.NegativeID
	disconnectionPoint.Color = update.Color
	/*	panel.AddPositivePanelJoins()*/
	_, err = disconnectionPoint.Update(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}
	//fmt.Println(panelRowsAff)

	//result, err := boiler.Panels(boiler.PanelWhere.StringID.EQ(stringId)).All(ctx, p.DB)
	return disconnectionPoint, nil
}

func (p *DisconnectionPointModel) Delete(disconnectionPointID string) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	disconnectionPoint, err := boiler.FindDisconnectionPoint(ctx, p.DB, disconnectionPointID)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	_, err = disconnectionPoint.Delete(ctx, p.DB)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	return nil
}
