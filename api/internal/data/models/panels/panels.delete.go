package panels

import (
	"context"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"time"
)

func (p *PanelModel) Delete(panelId string) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	panel, err := boiler.FindPanel(ctx, p.DB, panelId)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	_, err = panel.Delete(ctx, p.DB)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	return nil
}
