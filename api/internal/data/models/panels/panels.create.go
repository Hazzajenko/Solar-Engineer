package panels

import (
	"context"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"time"
)

func (p *PanelModel) Create(panel *boiler.Panel) (*boiler.Panel, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := panel.Insert(ctx, p.DB, boil.Infer())
	if err != nil {
		switch {
		default:
			return nil, err
		}
	}

	return panel, nil
}
