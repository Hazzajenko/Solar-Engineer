package data

import (
	"database/sql"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/blocks"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/cables"
	disconnection_points "github.com/Hazzajenko/gosolarbackend/internal/data/models/disconnection-points"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/inverters"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/joins"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/links"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/panels"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/projects"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/rails"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/strings"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/trackers"
	trays "github.com/Hazzajenko/gosolarbackend/internal/data/models/tray"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/users"
)

type Models struct {
	Users               users.UserModel
	Projects            projects.ProjectModel
	Inverters           inverters.InverterModel
	Trackers            trackers.TrackerModel
	Strings             strings.StringModel
	Panels              panels.PanelModel
	Links               links.LinkModel
	Cables              cables.CableModel
	Joins               joins.JoinModel
	DisconnectionPoints disconnection_points.DisconnectionPointModel
	Trays               trays.TrayModel
	Rails               rails.RailModel
	Blocks              blocks.BlockModel
}

func InitModels(db *sql.DB) Models {
	return Models{
		Users:               users.UserModel{DB: db},
		Projects:            projects.ProjectModel{DB: db},
		Inverters:           inverters.InverterModel{DB: db},
		Trackers:            trackers.TrackerModel{DB: db},
		Strings:             strings.StringModel{DB: db},
		Panels:              panels.PanelModel{DB: db},
		Links:               links.LinkModel{DB: db},
		Cables:              cables.CableModel{DB: db},
		Joins:               joins.JoinModel{DB: db},
		DisconnectionPoints: disconnection_points.DisconnectionPointModel{DB: db},
		Trays:               trays.TrayModel{DB: db},
		Rails:               rails.RailModel{DB: db},
		Blocks:              blocks.BlockModel{DB: db},
	}
}
