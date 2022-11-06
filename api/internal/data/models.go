package data

import (
	"database/sql"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/inverters"
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
}

func InitModels(db *sql.DB) Models {
	return Models{
		Users:     users.UserModel{DB: db},
		Projects:  projects.ProjectModel{DB: db},
		Inverters: inverters.InverterModel{DB: db},
		Trackers:  trackers.TrackerModel{DB: db},
		Strings:   strings.StringModel{DB: db},
	}
}
