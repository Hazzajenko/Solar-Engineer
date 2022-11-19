package strings

import (
	"context"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"time"
)

func (p *StringModel) Delete(stringId string) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	stringModel, err := boiler.FindString(ctx, p.DB, stringId)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	_, err = stringModel.Delete(ctx, p.DB)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	return nil
}
