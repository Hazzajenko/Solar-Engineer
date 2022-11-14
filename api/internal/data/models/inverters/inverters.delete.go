package inverters

import (
	"context"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"time"
)

func (p *InverterModel) Delete(inverterId int64) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	inverter, err := boiler.FindInverter(ctx, p.DB, inverterId)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	_, err = inverter.Delete(ctx, p.DB)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	return nil
}
