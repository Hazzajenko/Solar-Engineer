package trackers

import (
	"context"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"time"
)

func (p *TrackerModel) Delete(trackerId string) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	tracker, err := boiler.FindTracker(ctx, p.DB, trackerId)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	_, err = tracker.Delete(ctx, p.DB)
	if err != nil {
		switch {
		default:
			return err
		}
	}

	return nil
}
