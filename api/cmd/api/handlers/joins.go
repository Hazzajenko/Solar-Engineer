package handlers

import (
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/go-chi/chi/v5"
	"net/http"
	"strings"
	"time"
)

func (h *Handlers) CreateJoin(w http.ResponseWriter, r *http.Request) {
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
		ID        string `json:"id"`
		ProjectID int64  `json:"project_id"`
		Color     string `json:"color"`
		Size      int64  `json:"size"`
		Model     int    `json:"model"`
		Type      string `json:"type"`
	}

	err = h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	join := &boiler.Join{
		ID:        input.ID,
		ProjectID: projectId,
		CreatedAt: time.Time{},
		CreatedBy: userId,
		Color:     input.Color,
		Size:      input.Size,
	}

	result, err := h.Models.Joins.Create(join)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"join": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetJoinsByProjectId(w http.ResponseWriter, r *http.Request) {
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

	result, err := h.Models.Joins.GetJoinsByProjectId(projectId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"joins": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) UpdateJoin(w http.ResponseWriter, r *http.Request) {
	//bearerHeader := r.Header.Get("Authorization")
	//bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)
	//
	//userId, err := h.Tokens.GetUserIdInt64FromToken(bearer)
	//if err != nil {
	//	h.Logger.PrintError(err, nil)
	//}
	//fmt.Println(userId)

	//cableId := chi.URLParam(r, "cableId")

	var input struct {
		ID      string      `json:"id"`
		Changes boiler.Join `json:"changes"`
		/*		Location int64  `json:"location"`
				Size     int64  `json:"size"`
				Color    string `json:"color"`*/
	}

	err := h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	updateJoin := &boiler.Join{
		ID:    input.ID,
		Size:  input.Changes.Size,
		Color: input.Changes.Color,
	}

	result, err := h.Models.Joins.Update(updateJoin)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"join": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) DeleteJoin(w http.ResponseWriter, r *http.Request) {
	/*	bearerHeader := r.Header.Get("Authorization")
		bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

		userId, err := h.Tokens.GetUserIdInt64FromToken(bearer)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		fmt.Println(userId)*/

	/*	projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
		if err != nil {
			h.Logger.PrintError(err, nil)
		}*/
	//fmt.Println(projectId)

	joinId := chi.URLParam(r, "cableId")

	/*	cableId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "cableId"))
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		fmt.Println(cableId)*/

	/*	var input struct {
			ID string `json:"id"`
		}

		err = h.Json.DecodeJSON(w, r, &input)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}*/

	err := h.Models.Joins.Delete(joinId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"join_id": joinId, "deleted": true},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}
