package handlers

import (
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/projects"
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	"github.com/go-chi/chi/v5"
	"net/http"
	"strconv"
	"strings"
)

func (h *Handlers) CreateProject(w http.ResponseWriter, r *http.Request) {
	bearerHeader := r.Header.Get("Authorization")
	bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

	id, err := h.Tokens.GetUserIdFromToken(bearer)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	intVar, err := strconv.Atoi(id)

	var input struct {
		Name string `json:"name"`
	}

	err = h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	project := projects.Project{
		Name:      input.Name,
		CreatedBy: int64(intVar),
	}

	result, err := h.Models.Projects.Insert(&project)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	userProject := &projects.UserProject{
		UserId:    int64(intVar),
		ProjectId: result.ID,
		Role:      0,
	}

	err = h.Models.Projects.AddProjectToUser(userProject)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}
	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"name": project.Name},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) AddUserToProject(w http.ResponseWriter, r *http.Request) {
	var input struct {
		UserId    int64 `json:"user_id"`
		ProjectId int64 `json:"project_id"`
		Role      int   `json:"role"`
	}

	err := h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	userProject := &projects.UserProject{
		UserId:    input.UserId,
		ProjectId: input.ProjectId,
		Role:      input.Role,
	}

	err = h.Models.Projects.AddProjectToUser(userProject)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"user_id": input.UserId, "project_id": input.ProjectId},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetUserProjects(w http.ResponseWriter, r *http.Request) {

	getAllProjects, err := h.Models.Projects.GetAll()
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"projects": getAllProjects},
		nil)
	/*	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		getAllProjects,
		nil)*/
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetProjectById(w http.ResponseWriter, r *http.Request) {
	/*	bearerHeader := r.Header.Get("Authorization")
		bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

		idString, err := h.Tokens.GetUserIdFromToken(bearer)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		userId, err := strconv.Atoi(idString)*/
	//fmt.Println(userId)

	projectIdString := chi.URLParam(r, "projectId")
	projectId, err := strconv.Atoi(projectIdString)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	//fmt.Println(projectId)

	project, err := h.Models.Projects.Get(int64(projectId))
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"project": project},
		nil)
	/*	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		project,
		nil)*/
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetDataForProject(w http.ResponseWriter, r *http.Request) {
	/*	bearerHeader := r.Header.Get("Authorization")
		bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

		idString, err := h.Tokens.GetUserIdFromToken(bearer)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		userId, err := strconv.Atoi(idString)
		fmt.Println(userId)*/

	projectIdString := chi.URLParam(r, "projectId")
	projectId, err := strconv.Atoi(projectIdString)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	//fmt.Println(projectId)

	project, err := h.Models.Projects.Get(int64(projectId))
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}
	inverters, err := h.Models.Inverters.GetInvertersByProjectId(int64(projectId))
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	trackers, err := h.Models.Trackers.GetTrackersByProjectId(int64(projectId))
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	stringsByProjectId, err := h.Models.Strings.GetStringsByProjectId(int64(projectId))
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	panels, err := h.Models.Panels.GetPanelsByProjectId(int64(projectId))
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	cables, err := h.Models.Cables.GetCablesByProjectId(int64(projectId))
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{
			"project":            project,
			"inverters":          inverters,
			"trackers":           trackers,
			"stringsByProjectId": stringsByProjectId,
			"panels":             panels,
			"cables":             cables,
		},
		nil)
	/*	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		getAllProjects,
		nil)*/
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}
