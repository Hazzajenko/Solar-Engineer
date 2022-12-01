package handlers

import (
	"fmt"
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/go-chi/chi/v5"
	"net/http"
	"strings"
)

func (h *Handlers) CreateTray(w http.ResponseWriter, r *http.Request) {
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
		ID        string `json:"id"`
		ProjectID int64  `json:"project_id"`
		Model     int    `json:"model"`
		Type      string `json:"type"`
		Location  string `json:"location"`
		Size      int64  `json:"size"`
		Color     string `json:"color"`
	}

	err = h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}
	/*
		positivePanel, err := h.Models.Panels.GetById(input.PositiveID)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}

		negativePanel, err := h.Models.Panels.GetById(input.NegativeID)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}*/

	boilerTray := &boiler.Tray{
		ID:        input.ID,
		ProjectID: input.ProjectID,
		Model:     input.Model,
		Type:      input.Type,
		Location:  input.Location,
		Size:      input.Size,
		Color:     input.Color,
	}

	result, err := h.Models.Trays.Create(boilerTray)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"tray": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetTraysByProjectId(w http.ResponseWriter, r *http.Request) {
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

	result, err := h.Models.Trays.GetTrayByProjectId(projectId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"trays": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) UpdateTray(w http.ResponseWriter, r *http.Request) {
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

	trayId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "trayId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	fmt.Println(trayId)

	/*	type Changes struct {
		ID         string `json:"id"`
		ProjectId  int64  `json:"project_id"`
		InverterId int64  `json:"inverter_id"`
		TrackerId  int64  `json:"tracker_id"`
		StringId   int64  `json:"string_id"`
		Location   int64  `json:"location"`
	}*/

	var input struct {
		ID      string      `json:"id"`
		Changes boiler.Tray `json:"changes"`
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

	update := &boiler.Tray{
		ID:       input.ID,
		Location: input.Changes.Location,
		Size:     input.Changes.Size,
		Color:    input.Changes.Color,
	}

	result, err := h.Models.Trays.Update(update)
	//result, err := h.Models.Panels.UpdatePanelLocation(updatePanel)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"tray": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) DeleteTray(w http.ResponseWriter, r *http.Request) {
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
	trayId := chi.URLParam(r, "trayId")

	/*	var input struct {
			ID string `json:"id"`
		}

		err := h.Json.DecodeJSON(w, r, &input)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}
	*/
	err := h.Models.Trays.Delete(trayId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"id": trayId, "deleted": true},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}
