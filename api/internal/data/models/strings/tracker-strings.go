package strings

import (
	"context"
	"time"
)

type TrackerString struct {
	TrackerId int64 `json:"trackerId"`
	StringId  int64 `json:"stringId"`
}

func (p *StringModel) InsertTrackerString(trackerString *TrackerString) error {
	query := `
		INSERT INTO trackers_strings(tracker_id, string_id)
		VALUES ($1, $2)`

	args := []any{trackerString.TrackerId, trackerString.StringId}
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
