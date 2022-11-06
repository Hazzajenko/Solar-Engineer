package trackers

import (
	"context"
	"time"
)

type InverterTracker struct {
	InverterId int64 `json:"inverterId"`
	TrackerId  int64 `json:"trackerId"`
}

func (p *TrackerModel) InsertInverterTracker(inverterTracker *InverterTracker) error {
	query := `
		INSERT INTO inverters_trackers(inverter_id, tracker_id)
		VALUES ($1, $2)`

	args := []any{inverterTracker.InverterId, inverterTracker.TrackerId}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := p.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		default:
			return err
		}
	}
	return nil

}
