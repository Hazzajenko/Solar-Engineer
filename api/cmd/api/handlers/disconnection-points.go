package handlers

import (
	"fmt"
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/go-chi/chi/v5"
	"net/http"
	"strings"
)

func (h *Handlers) CreateDisconnectionPoint(w http.ResponseWriter, r *http.Request) {
	bearerHeader := r.Header.Get("Authorization")
	bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

	_, err := h.Tokens.GetUserIdInt64FromToken(bearer)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	_, err = h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	var input struct {
		ID                string `json:"id"`
		ProjectID         int64  `json:"project_id"`
		StringID          string `json:"string_id"`
		PositiveID        string `json:"positive_id"`
		NegativeID        string `json:"negative_id"`
		DisconnectionType int    `json:"disconnection_type"`
		Model             int    `json:"model"`
		Location          string `json:"location"`
		Color             string `json:"color"`
	}

	err = h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	/*	positivePanel, err := h.Models.Panels.GetById(input.PositiveID)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}

		negativePanel, err := h.Models.Panels.GetById(input.NegativeID)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}*/

	disconnectionPoint := &boiler.DisconnectionPoint{
		ID:                input.ID,
		ProjectID:         input.ProjectID,
		StringID:          input.StringID,
		PositiveID:        input.ID,
		NegativeID:        input.ID,
		DisconnectionType: input.DisconnectionType,
		Location:          input.Location,
		Model:             input.Model,
		Color:             input.Color,
	}

	result, err := h.Models.DisconnectionPoints.Create(disconnectionPoint)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"disconnection_point": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetDisconnectionPointsByProjectId(w http.ResponseWriter, r *http.Request) {
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

	result, err := h.Models.DisconnectionPoints.GetByProjectID(projectId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"disconnection_points": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) UpdateDisconnectionPoint(w http.ResponseWriter, r *http.Request) {
	//bearerHeader := r.Header.Get("Authorization")
	//bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)
	//
	//userId, err := h.Tokens.GetUserIdInt64FromToken(bearer)
	//if err != nil {
	//	h.Logger.PrintError(err, nil)
	//}
	//fmt.Println(userId)

	projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	fmt.Println(projectId)

	/*	_, err = h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "disconnectionPointId"))
		if err != nil {
			h.Logger.PrintError(err, nil)
		}*/
	//fmt.Println(panelId)

	/*	type Changes struct {
		ID         string `json:"id"`
		ProjectId  int64  `json:"project_id"`
		InverterId int64  `json:"inverter_id"`
		TrackerId  int64  `json:"tracker_id"`
		StringId   int64  `json:"string_id"`
		Location   int64  `json:"location"`
	}*/

	var input struct {
		ID      string                    `json:"id"`
		Changes boiler.DisconnectionPoint `json:"changes"`
		/*		InverterId int64 `json:"inverter_id"`
				TrackerId  int64 `json:"tracker_id"`
				StringId   int64 `json:"string_id"`
				Location   int64 `json:"location"`*/
		//Version    int32  `json:"version"`
	}

	err = h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	fmt.Print(input)
	/*
		updatePanel := &panels.Panel{
			ID:         input.ID,
			InverterId: input.InverterId,
			TrackerId:  input.TrackerId,
			StringId:   input.StringId,
			Location:   input.Location,
			//Version:    input.Version,
		}*/

	update := &boiler.DisconnectionPoint{
		ID:         input.ID,
		StringID:   input.Changes.StringID,
		Location:   input.Changes.Location,
		PositiveID: input.Changes.PositiveID,
		NegativeID: input.Changes.NegativeID,
		Color:      input.Changes.Color,
		//Version:    input.Version,
	}

	result, err := h.Models.DisconnectionPoints.Update(update)
	//result, err := h.Models.Panels.UpdatePanelLocation(updatePanel)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"disconnection_point": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) DeleteDisconnectionPoint(w http.ResponseWriter, r *http.Request) {
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
	disconnectionPointId := chi.URLParam(r, "disconnectionPointId")

	/*	var input struct {
			ID string `json:"id"`
		}

		err := h.Json.DecodeJSON(w, r, &input)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}
	*/
	err := h.Models.DisconnectionPoints.Delete(disconnectionPointId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"id": disconnectionPointId, "deleted": true},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}
