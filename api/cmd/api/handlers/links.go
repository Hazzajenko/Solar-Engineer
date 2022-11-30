package handlers

import (
	"fmt"
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/go-chi/chi/v5"
	"net/http"
	"strings"
)

func (h *Handlers) CreateLink(w http.ResponseWriter, r *http.Request) {
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
		ProjectID     int64  `json:"project_id"`
		ID            string `json:"id"`
		StringID      string `json:"string_id"`
		PositiveID    string `json:"positive_id"`
		NegativeID    string `json:"negative_id"`
		PositiveModel int    `json:"positive_model"`
		NegativeModel int    `json:"negative_model"`
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

	boilerPanel := &boiler.Link{
		PositiveID:    input.PositiveID,
		NegativeID:    input.NegativeID,
		PositiveModel: input.PositiveModel,
		NegativeModel: input.NegativeModel,
		StringID:      input.StringID,
		ProjectID:     input.ProjectID,
		ID:            input.ID,
	}

	result, err := h.Models.PanelJoins.Create(boilerPanel)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"link": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetLinksByProjectId(w http.ResponseWriter, r *http.Request) {
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

	result, err := h.Models.PanelJoins.GetLinksByProjectId(projectId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"links": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) UpdateLink(w http.ResponseWriter, r *http.Request) {
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

	panelId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "panelId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	fmt.Println(panelId)

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
		Changes boiler.Link `json:"changes"`
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

	update := &boiler.Link{
		ID:            input.ID,
		StringID:      input.Changes.StringID,
		PositiveID:    input.Changes.PositiveID,
		NegativeID:    input.Changes.NegativeID,
		PositiveModel: input.Changes.PositiveModel,
		NegativeModel: input.Changes.NegativeModel,
		//Version:    input.Version,
	}

	result, err := h.Models.PanelJoins.Update(update)
	//result, err := h.Models.Panels.UpdatePanelLocation(updatePanel)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"link": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) DeleteLink(w http.ResponseWriter, r *http.Request) {
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
	linkId := chi.URLParam(r, "linkId")

	/*	var input struct {
			ID string `json:"id"`
		}

		err := h.Json.DecodeJSON(w, r, &input)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}
	*/
	err := h.Models.PanelJoins.Delete(linkId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"id": linkId, "deleted": true},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}
