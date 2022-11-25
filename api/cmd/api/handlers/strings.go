package handlers

import (
	stringModels "github.com/Hazzajenko/gosolarbackend/internal/data/models/strings"
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/go-chi/chi/v5"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func (h *Handlers) CreateString(w http.ResponseWriter, r *http.Request) {
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

	/*	inverterId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "inverterId"))
		if err != nil {
			h.Logger.PrintError(err, nil)
		}

		trackerId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "trackerId"))
		if err != nil {
			h.Logger.PrintError(err, nil)
		}*/

	var input struct {
		ID           string `json:"id"`
		Name         string `json:"name"`
		IsInParallel bool   `json:"is_in_parallel"`
		ProjectID    int64  `json:"project_id"`
		/*		InverterID   string `json:"inverter_id"`
				TrackerID    string `json:"tracker_id"`*/
		Color string `json:"color"`
		Model int    `json:"model"`

		//Tracker      trackers.Tracker `json:"tracker"`
	}

	err = h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	/*	stringModel := &stringModels.String{
		ProjectId:    projectId,
		InverterId:   inverterId,
		TrackerId:    trackerId,
		Name:         input.Name,
		CreatedBy:    userId,
		IsInParallel: input.IsInParallel,
		PanelAmount:  0,
	}*/

	boilerString := &boiler.String{
		ID:        input.ID,
		ProjectID: projectId,
		/*		InverterID:   input.InverterID,
				TrackerID:    input.TrackerID,*/
		Name:         input.Name,
		CreatedAt:    time.Time{},
		CreatedBy:    userId,
		IsInParallel: input.IsInParallel,
		Model:        input.Model,
		Color:        input.Color,
	}

	result, err := h.Models.Strings.Insert(boilerString)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	h.Logger.PrintInfo("new string id:", map[string]string{"id": result.ID})

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"string": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetStringsByProjectId(w http.ResponseWriter, r *http.Request) {
	/*	bearerHeader := r.Header.Get("Authorization")
		bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)
	*/
	projectIdString := chi.URLParam(r, "projectId")
	projectId, err := strconv.Atoi(projectIdString)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	//fmt.Println(projectId)

	/*	idString, err := h.Tokens.GetUserIdFromToken(bearer)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		userId, err := strconv.Atoi(idString)*/
	//fmt.Println(userId)

	result, err := h.Models.Strings.GetStringsByProjectId(int64(projectId))
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"strings": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) UpdateString(w http.ResponseWriter, r *http.Request) {
	/*	bearerHeader := r.Header.Get("Authorization")
		bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

		projectIdString := chi.URLParam(r, "projectId")
		projectId, err := strconv.Atoi(projectIdString)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}*/
	//fmt.Println(projectId)

	/*	idString, err := h.Tokens.GetUserIdFromToken(bearer)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		userId, err := strconv.Atoi(idString)
		fmt.Println(userId)*/

	var input struct {
		Name         string `json:"name"`
		IsInParallel bool   `json:"isInParallel"`
		InverterId   int64  `json:"inverterId"`
		TrackerId    int64  `json:"trackerId"`
		ID           int64  `json:"id"`
		Version      int32  `json:"version"`
		PanelAmount  int64  `json:"panelAmount"`
	}

	err := h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	updateString := &stringModels.String{
		ID:           input.ID,
		InverterId:   input.InverterId,
		TrackerId:    input.TrackerId,
		Name:         input.Name,
		Version:      input.Version,
		IsInParallel: input.IsInParallel,
		PanelAmount:  input.PanelAmount,
	}

	result, err := h.Models.Strings.UpdateString(updateString)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"string": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) UpdateStringColor(w http.ResponseWriter, r *http.Request) {
	/*	bearerHeader := r.Header.Get("Authorization")
		bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

		projectIdString := chi.URLParam(r, "projectId")
		projectId, err := strconv.Atoi(projectIdString)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		//fmt.Println(projectId)

		idString, err := h.Tokens.GetUserIdFromToken(bearer)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		userId, err := strconv.Atoi(idString)*/
	//fmt.Println(userId)

	stringId := chi.URLParam(r, "stringId")

	/*	var input struct {
		ID    string `json:"id"`
		Color string `json:"color"`
	}*/

	var input struct {
		ID      string        `json:"id"`
		Changes boiler.String `json:"changes"`
	}

	err := h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	updateString := &boiler.String{
		ID:           stringId,
		Name:         input.Changes.Name,
		IsInParallel: input.Changes.IsInParallel,
		Color:        input.Changes.Color,
	}

	result, _, err := h.Models.Strings.UpdateBoilerStringColor(updateString)
	//fmt.Println(rowsAff)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	panels, panelsAff, err := h.Models.Panels.UpdatePanelsColor(updateString.ID, updateString.Color)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"string": result, "panelsChanged": panelsAff, "panels": panels},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) DeleteString(w http.ResponseWriter, r *http.Request) {
	/*	bearerHeader := r.Header.Get("Authorization")
		bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

		userId, err := h.Tokens.GetUserIdInt64FromToken(bearer)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		//fmt.Println(userId)

		projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
		if err != nil {
			h.Logger.PrintError(err, nil)
		}*/
	//fmt.Println(projectId)
	stringId := chi.URLParam(r, "stringId")
	/*
		var input struct {
			ID string `json:"id"`
		}

		err := h.Json.DecodeJSON(w, r, &input)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}*/

	err := h.Models.Strings.Delete(stringId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"string": stringId, "deleted": true},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}
