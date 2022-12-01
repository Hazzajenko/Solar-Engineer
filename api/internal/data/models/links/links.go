package links

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"time"
)

type LinkModel struct {
	DB *sql.DB
}

func (p *LinkModel) GetById(linkId string) (*boiler.Link, error) {
	if linkId == "" {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	panelJoin, err := boiler.FindLink(ctx, p.DB, linkId)
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

func (p *LinkModel) Create(link *boiler.Link) (*boiler.Link, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := link.Insert(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	return link, nil
}

func (p *LinkModel) GetLinksByProjectId(projectId int64) (*boiler.LinkSlice, error) {
	if projectId < 1 {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	links, err := boiler.Links(boiler.LinkWhere.ProjectID.EQ(projectId)).All(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("record not found")
		default:
			return nil, err
		}
	}

	return &links, nil
}

func (p *LinkModel) Update(update *boiler.Link) (*boiler.Link, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	panelJoin, err := boiler.Links(boiler.LinkWhere.ID.EQ(update.ID)).One(ctx, p.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	panelJoin.StringID = update.StringID
	//panel.TrackerID = update.TrackerID
	panelJoin.PositiveID = update.PositiveID
	panelJoin.NegativeID = update.NegativeID
	panelJoin.PositiveModel = update.PositiveModel
	panelJoin.NegativeModel = update.NegativeModel
	panelJoin.CableID = update.CableID
	/*	panel.AddPositivePanelJoins()*/
	_, err = panelJoin.Update(ctx, p.DB, boil.Infer())
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
	return panelJoin, nil
}

func (p *LinkModel) Delete(linkId string) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	link, err := boiler.FindLink(ctx, p.DB, linkId)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	_, err = link.Delete(ctx, p.DB)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	return nil
}
