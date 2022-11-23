package handlers

import (
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/go-chi/chi/v5"
	"net/http"
	"strings"
	"time"
)

func (h *Handlers) CreateCable(w http.ResponseWriter, r *http.Request) {
	bearerHeader := r.Header.Get("Authorization")
	bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

	userId, err := h.Tokens.GetUserIdInt64FromToken(bearer)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	var input struct {
		ID       string `json:"id"`
		JoinID   string `json:"join_id"`
		Location string `json:"location"`
		Color    string `json:"color"`
		Size     int64  `json:"size"`
		Model    int    `json:"model"`
		Type     string `json:"type"`
	}

	err = h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	isLocationFree, err := h.Models.Panels.CheckIfLocationIsFree(input.Location)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	if isLocationFree != nil {
		switch {
		default:
			h.Logger.PrintInfo("location not free", nil)
		}
		return
	}

	cable := &boiler.Cable{
		ID:        input.ID,
		ProjectID: projectId,
		JoinID:    input.JoinID,
		Location:  input.Location,
		CreatedAt: time.Time{},
		CreatedBy: userId,
		Color:     input.Color,
		Size:      input.Size,
	}

	result, err := h.Models.Cables.Create(cable)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"cable": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetCablesByProjectId(w http.ResponseWriter, r *http.Request) {
	/*	bearerHeader := r.Header.Get("Authorization")
		bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)*/

	/*	projectIdString := chi.URLParam(r, "projectId")
		projectId, err := strconv.Atoi(projectIdString)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}*/

	projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	//fmt.Println(projectId)

	//idString, err := h.Tokens.GetUserIdFromToken(bearer)
	//if err != nil {
	//	h.Logger.PrintError(err, nil)
	//}
	//userId, err := strconv.Atoi(idString)
	//fmt.Println(userId)

	result, err := h.Models.Cables.GetCablesByProjectId(projectId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"cables": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) UpdateCable(w http.ResponseWriter, r *http.Request) {

	var input struct {
		ID      string       `json:"id"`
		Changes boiler.Cable `json:"changes"`
	}

	err := h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	updateCable := &boiler.Cable{
		ID:       input.ID,
		Location: input.Changes.Location,
		Size:     input.Changes.Size,
		Color:    input.Changes.Color,
		JoinID:   input.Changes.JoinID,
		InJoin:   input.Changes.InJoin,
	}

	result, err := h.Models.Cables.Update(updateCable)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"cable": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) UpdateManyCables(w http.ResponseWriter, r *http.Request) {
	type Changes struct {
		NewJoinID string `json:"new_join_id"`
		OldJoinId string `json:"old_join_id"`
	}

	var input struct {
		ProjectID int64   `json:"project_id"`
		Changes   Changes `json:"changes"`
	}

	err := h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	result, err := h.Models.Cables.UpdateMany(input.Changes.NewJoinID, input.Changes.OldJoinId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"cables": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) DeleteCable(w http.ResponseWriter, r *http.Request) {
	cableId := chi.URLParam(r, "cableId")

	err := h.Models.Cables.Delete(cableId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"panel": cableId, "deleted": true},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}
