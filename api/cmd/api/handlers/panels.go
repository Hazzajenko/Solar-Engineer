package handlers

import (
	json2 "encoding/json"
	"fmt"
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/go-chi/chi/v5"
	"net/http"
	"os"
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

	projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	var input struct {
		ID string `json:"id"`
		//ProjectId  int64  `json:"project_id"`
		/*		InverterId string `json:"inverter_id"`
				TrackerId  string `json:"tracker_id"`*/
		StringId string `json:"string_id"`
		Location string `json:"location"`
		Color    string `json:"color"`
	}

	err = h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	_, err = h.Models.Strings.Get(input.StringId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
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

	file, err := os.ReadFile("assets/json/panels/longi555m.json")
	var boilerData boiler.Panel

	_ = json2.Unmarshal([]byte(file), &boilerData)

	boilerPanel := &boiler.Panel{
		ID:        input.ID,
		ProjectID: projectId,
		/*		InverterID:              input.InverterId,
				TrackerID:               input.TrackerId,*/
		StringID:                input.StringId,
		Name:                    boilerData.Name,
		Location:                input.Location,
		CreatedAt:               time.Time{},
		CreatedBy:               userId,
		CurrentAtMaximumPower:   boilerData.CurrentAtMaximumPower,
		ShortCircuitCurrent:     boilerData.ShortCircuitCurrent,
		ShortCircuitCurrentTemp: boilerData.ShortCircuitCurrentTemp,
		MaximumPower:            boilerData.MaximumPower,
		MaximumPowerTemp:        boilerData.MaximumPowerTemp,
		VoltageAtMaximumPower:   boilerData.VoltageAtMaximumPower,
		OpenCircuitVoltage:      boilerData.OpenCircuitVoltage,
		OpenCircuitVoltageTemp:  boilerData.OpenCircuitVoltageTemp,
		Length:                  boilerData.Length,
		Weight:                  boilerData.Weight,
		Width:                   boilerData.Width,
		Color:                   input.Color,
	}

	result, err := h.Models.Panels.Create(boilerPanel)
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

	result, err := h.Models.Panels.GetPanelsByProjectId(projectId)
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
	//bearerHeader := r.Header.Get("Authorization")
	//bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)
	//
	//userId, err := h.Tokens.GetUserIdInt64FromToken(bearer)
	//if err != nil {
	//	h.Logger.PrintError(err, nil)
	//}
	//fmt.Println(userId)

	//projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
	//if err != nil {
	//	h.Logger.PrintError(err, nil)
	//}
	//fmt.Println(projectId)

	var input struct {
		ID         string `json:"id"`
		InverterId string `json:"inverter_id"`
		TrackerId  string `json:"tracker_id"`
		StringId   string `json:"string_id"`
		Location   string `json:"location"`
		//Version    int32  `json:"version"`
	}

	err := h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}
	/*
		updatePanel := &panels.Panel{
			ID:         input.ID,
			InverterId: input.InverterId,
			TrackerId:  input.TrackerId,
			StringId:   input.StringId,
			Location:   input.Location,
			//Version:    input.Version,
		}*/

	update := &boiler.Panel{
		ID:         input.ID,
		InverterID: input.InverterId,
		TrackerID:  input.TrackerId,
		StringID:   input.StringId,
		Location:   input.Location,
		//Version:    input.Version,
	}

	result, err := h.Models.Panels.UpdatePanel(update)
	//result, err := h.Models.Panels.UpdatePanelLocation(updatePanel)
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

func (h *Handlers) PutPanel(w http.ResponseWriter, r *http.Request) {
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

	//panelId := chi.URLParam(r, "panelId")
	/*
		, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "panelId"))
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		fmt.Println(panelId)*/

	/*	type Changes struct {
		ID         string `json:"id"`
		ProjectId  int64  `json:"project_id"`
		InverterId int64  `json:"inverter_id"`
		TrackerId  int64  `json:"tracker_id"`
		StringId   int64  `json:"string_id"`
		Location   int64  `json:"location"`
	}*/

	var input struct {
		ID      string       `json:"id"`
		Changes boiler.Panel `json:"changes"`
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

	update := &boiler.Panel{
		ID:       input.ID,
		StringID: input.Changes.StringID,
		Location: input.Changes.Location,
		Color:    input.Changes.Color,
		//Version:    input.Version,
	}

	result, err := h.Models.Panels.UpdatePanel(update)
	//result, err := h.Models.Panels.UpdatePanelLocation(updatePanel)
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

func (h *Handlers) DeletePanel(w http.ResponseWriter, r *http.Request) {
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
	panelID := chi.URLParam(r, "panelId")

	/*	var input struct {
			ID string `json:"id"`
		}

		err := h.Json.DecodeJSON(w, r, &input)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}
	*/
	err := h.Models.Panels.Delete(panelID)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"id": panelID, "deleted": true},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}
