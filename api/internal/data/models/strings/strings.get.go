package strings

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"time"
)

func (p *StringModel) GetById(stringId int64) (*boiler.String, error) {
	if stringId < 1 {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	getString, err := boiler.FindString(ctx, p.DB, stringId)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	return getString, nil
}
