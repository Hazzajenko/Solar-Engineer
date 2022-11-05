package data

import (
	"database/sql"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/inverters"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/projects"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/users"
)

type Models struct {
	Users     users.UserModel
	Projects  projects.ProjectModel
	Inverters inverters.InverterModel
}

func InitModels(db *sql.DB) Models {
	return Models{
		Users:     users.UserModel{DB: db},
		Projects:  projects.ProjectModel{DB: db},
		Inverters: inverters.InverterModel{DB: db},
	}
}
