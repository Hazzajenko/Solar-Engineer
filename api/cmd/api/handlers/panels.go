package handlers

import (
	json2 "encoding/json"
	"fmt"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/panels"
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	"github.com/go-chi/chi/v5"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

func (h *Handlers) CreatePanel(w http.ResponseWriter, r *http.Request) {
	bearerHeader := r.Header.Get("Authorization")
	bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

	userId, err := h.Tokens.GetUserIdInt64FromToken(bearer)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	/*	idString, err := h.Tokens.GetUserIdFromToken(bearer)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		userId, err := strconv.Atoi(idString)*/

	/*	projectIdString := chi.URLParam(r, "projectId")
		projectId, err := strconv.Atoi(projectIdString)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		fmt.Println(projectId)

		inverterIdString := chi.URLParam(r, "inverterId")
		inverterId, err := strconv.Atoi(inverterIdString)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		fmt.Println(inverterId)

		trackerIdString := chi.URLParam(r, "trackerId")
		trackerId, err := strconv.Atoi(trackerIdString)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		fmt.Println(trackerId)*/

	projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	inverterId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "inverterId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	trackerId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "trackerId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	//stringIdString := chi.URLParam(r, "stringId")
	//stringId, err := strconv.Atoi(stringIdString)
	stringId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "stringId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	fmt.Println(stringId)
	/*
		var input struct {
			String strings2.String `json:"string"`
		}

		err = h.Json.DecodeJSON(w, r, &input)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}*/

	/*	stringModel, err := h.Models.Strings.Get(stringId)
		if err != nil {
			switch {
			default:
				h.Errors.ServerErrorResponse(w, r, err)
			}
			return
		}*/

	file, err := os.ReadFile("assets/json/panels/longi555m.json")
	var data panels.Panel
	//var result []*trackers.Tracker

	//data := inverters.Inverter{}
	_ = json2.Unmarshal([]byte(file), &data)

	panel := &panels.Panel{
		ProjectId:               projectId,
		InverterId:              inverterId,
		TrackerId:               trackerId,
		StringId:                stringId,
		Name:                    data.Name,
		Location:                data.Location,
		CreatedAt:               time.Time{},
		CreatedBy:               userId,
		CurrentAtMaximumPower:   data.CurrentAtMaximumPower,
		ShortCircuitCurrent:     data.ShortCircuitCurrent,
		ShortCircuitCurrentTemp: data.ShortCircuitCurrentTemp,
		MaximumPower:            data.MaximumPower,
		MaximumPowerTemp:        data.MaximumPowerTemp,
		VoltageAtMaximumPower:   data.VoltageAtMaximumPower,
		OpenCircuitVoltage:      data.OpenCircuitVoltage,
		OpenCircuitVoltageTemp:  data.OpenCircuitVoltageTemp,
		Length:                  data.Length,
		Weight:                  data.Weight,
		Width:                   data.Width,
	}

	result, err := h.Models.Panels.Insert(panel)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	stringPanel := &panels.StringPanel{
		StringId: stringId,
		PanelId:  result.ID,
	}

	err = h.Models.Panels.InsertStringPanel(stringPanel)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}
	/*
		stringModel := &strings2.String{
			ID:          input.String.ID,
			PanelAmount: input.String.PanelAmount,
			Version:     input.String.Version,
		}

		resultString, err := h.Models.Strings.UpdatePanelAmount(stringModel)
		if err != nil {
			switch {
			default:
				h.Errors.ServerErrorResponse(w, r, err)
			}
			return
		}*/

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"panel": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetPanelsByProjectId(w http.ResponseWriter, r *http.Request) {
	bearerHeader := r.Header.Get("Authorization")
	bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

	projectIdString := chi.URLParam(r, "projectId")
	projectId, err := strconv.Atoi(projectIdString)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	fmt.Println(projectId)

	idString, err := h.Tokens.GetUserIdFromToken(bearer)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	userId, err := strconv.Atoi(idString)
	fmt.Println(userId)

	result, err := h.Models.Panels.GetPanelsByProjectId(int64(projectId))
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"panels": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) UpdatePanelLocation(w http.ResponseWriter, r *http.Request) {
	bearerHeader := r.Header.Get("Authorization")
	bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

	userId, err := h.Tokens.GetUserIdInt64FromToken(bearer)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	fmt.Println(userId)

	projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	fmt.Println(projectId)

	/*	idString, err := h.Tokens.GetUserIdFromToken(bearer)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		userId, err := strconv.Atoi(idString)
		fmt.Println(userId)*/

	var input struct {
		ID         int64  `json:"id"`
		InverterId int64  `json:"inverterId"`
		TrackerId  int64  `json:"trackerId"`
		StringId   int64  `json:"stringId"`
		Location   string `json:"location"`
		Version    int32  `json:"version"`
	}

	err = h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	updatePanel := &panels.Panel{
		ID:         input.ID,
		InverterId: input.InverterId,
		TrackerId:  input.TrackerId,
		StringId:   input.StringId,
		Location:   input.Location,
		Version:    input.Version,
	}

	result, err := h.Models.Panels.UpdatePanelLocation(updatePanel)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"panel": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}
