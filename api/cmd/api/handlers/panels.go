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

	idString, err := h.Tokens.GetUserIdFromToken(bearer)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	userId, err := strconv.Atoi(idString)

	projectIdString := chi.URLParam(r, "projectId")
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
	fmt.Println(trackerId)

	stringIdString := chi.URLParam(r, "stringId")
	stringId, err := strconv.Atoi(stringIdString)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	fmt.Println(stringId)

	file, err := os.ReadFile("assets/json/panels/longi555m.json")
	var data panels.Panel
	//var result []*trackers.Tracker

	//data := inverters.Inverter{}
	_ = json2.Unmarshal([]byte(file), &data)

	panel := &panels.Panel{
		ProjectId:               int64(projectId),
		InverterId:              int64(inverterId),
		TrackerId:               int64(trackerId),
		StringId:                int64(stringId),
		Name:                    data.Name,
		Location:                data.Location,
		CreatedAt:               time.Time{},
		CreatedBy:               int64(userId),
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
		StringId: int64(stringId),
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
