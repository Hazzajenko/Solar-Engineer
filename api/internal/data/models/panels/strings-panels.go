package panels

import (
	"context"
	"time"
)

type StringPanel struct {
	StringId int64 `json:"stringId"`
	PanelId  int64 `json:"panelId"`
}

func (p *PanelModel) InsertStringPanel(stringPanel *StringPanel) error {
	query := `
		INSERT INTO strings_panels(string_id, panel_id)
		VALUES ($1, $2)`

	args := []any{stringPanel.StringId, stringPanel.PanelId}
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
