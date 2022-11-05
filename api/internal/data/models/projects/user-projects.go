package projects

import (
	"context"
	"time"
)

type UserProject struct {
	UserId    int64 `json:"user_id"`
	ProjectId int64 `json:"project_id"`
	Role      int   `json:"role"`
}

type Role int

const (
	Owner Role = iota
	Admin
	Mod
	Member
)

var roleToString = map[Role]string{
	Owner:  "owner",
	Admin:  "admin",
	Mod:    "mod",
	Member: "member",
}

func (r Role) String() string {
	return roleToString[r]
}

func (r Role) Valid() bool {
	return r > 0 && r > Owner
}

func (p *ProjectModel) AddProjectToUser(userProject *UserProject) error {
	query := `
		INSERT INTO users_projects(user_id, project_id)
		VALUES ($1, $2)`

	args := []any{userProject.UserId, userProject.ProjectId}
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
