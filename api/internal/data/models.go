package data

import (
	"database/sql"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/cables"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/inverters"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/joins"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/panels"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/projects"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/strings"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/trackers"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/users"
)

type Models struct {
	Users     users.UserModel
	Projects  projects.ProjectModel
	Inverters inverters.InverterModel
	Trackers  trackers.TrackerModel
	Strings   strings.StringModel
	Panels    panels.PanelModel
	Cables    cables.CableModel
	Joins     joins.JoinModel
}

func InitModels(db *sql.DB) Models {
	return Models{
		Users:     users.UserModel{DB: db},
		Projects:  projects.ProjectModel{DB: db},
		Inverters: inverters.InverterModel{DB: db},
		Trackers:  trackers.TrackerModel{DB: db},
		Strings:   strings.StringModel{DB: db},
		Panels:    panels.PanelModel{DB: db},
		Cables:    cables.CableModel{DB: db},
		Joins:     joins.JoinModel{DB: db},
	}
}
