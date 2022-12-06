package handlers

import (
	"fmt"
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/go-chi/chi/v5"
	"net/http"
	"strings"
)

func (h *Handlers) CreateRail(w http.ResponseWriter, r *http.Request) {
	bearerHeader := r.Header.Get("Authorization")
	bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

	_, err := h.Tokens.GetUserIdInt64FromToken(bearer)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	var input struct {
		ID            string `json:"id"`
		ProjectID     int64  `json:"project_id"`
		Model         int    `json:"model"`
		Type          int    `json:"type"`
		Location      string `json:"location"`
		IsChildBlock  bool   `json:"is_child_block"`
		ParentBlockId string `json:"parent_block_id"`
	}

	err = h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	boilerRail := &boiler.Rail{
		ID:            input.ID,
		ProjectID:     projectId,
		Model:         input.Model,
		Type:          input.Type,
		Location:      input.Location,
		IsChildBlock:  input.IsChildBlock,
		ParentBlockID: input.ParentBlockId,
	}

	result, err := h.Models.Rails.Create(boilerRail)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"rail": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) CreateManyRail(w http.ResponseWriter, r *http.Request) {
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
		Rails []boiler.Rail `json:"rails"`
	}

	err = h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	err = h.Models.Rails.CreateMany(input.Rails)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"rails": true},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetRailsByProjectId(w http.ResponseWriter, r *http.Request) {
	projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	result, err := h.Models.Rails.GetRailByProjectId(projectId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"rails": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) UpdateRail(w http.ResponseWriter, r *http.Request) {
	projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	fmt.Println(projectId)

	_, err = h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "railId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

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
		Changes boiler.Rail `json:"changes"`
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

	update := &boiler.Rail{
		ID:       input.ID,
		Location: input.Changes.Location,
	}

	result, err := h.Models.Rails.Update(update)
	//result, err := h.Models.Panels.UpdatePanelLocation(updatePanel)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"rail": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) DeleteRail(w http.ResponseWriter, r *http.Request) {

	railId := chi.URLParam(r, "railId")

	/*	var input struct {
			ID string `json:"id"`
		}

		err := h.Json.DecodeJSON(w, r, &input)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}
	*/
	err := h.Models.Rails.Delete(railId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"id": railId, "deleted": true},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) DeleteManyRails(w http.ResponseWriter, r *http.Request) {

	var input struct {
		Rails boiler.RailSlice `json:"rails"`
	}
	err := h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	railsDeleted, err := h.Models.Rails.DeleteMany(&input.Rails)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"rails_deleted": railsDeleted, "deleted": true},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}
