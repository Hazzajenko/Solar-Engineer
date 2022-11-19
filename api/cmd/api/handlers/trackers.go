package handlers

import (
	json2 "encoding/json"
	"fmt"
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/go-chi/chi/v5"
	"net/http"
	"os"
	"strconv"
	"strings"
)

func (h *Handlers) CreateTracker(w http.ResponseWriter, r *http.Request) {
	bearerHeader := r.Header.Get("Authorization")
	bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

	idString, err := h.Tokens.GetUserIdFromToken(bearer)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	userId, err := strconv.Atoi(idString)

	projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
	if err != nil {
		h.Logger.PrintError(err, nil)
	}

	//fmt.Println(projectId)

	inverterId := chi.URLParam(r, "inverterId")
	/*	inverterId, err := strconv.Atoi(inverterIdString)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}*/
	//fmt.Println(inverterId)

	file, err := os.ReadFile("assets/json/trackers/tauroeco100-3-d.json")
	var data []boiler.Tracker
	var result []*boiler.Tracker

	//data := inverters.Inverter{}
	_ = json2.Unmarshal([]byte(file), &data)
	for index, item := range data {
		tracker := &boiler.Tracker{
			ProjectID:              projectId,
			InverterID:             inverterId,
			Name:                   fmt.Sprintf("Tracker %d", index),
			CreatedBy:              int64(userId),
			MaxInputCurrent:        item.MaxInputCurrent,
			MaxShortCircuitCurrent: item.MaxShortCircuitCurrent,
		}

		itemResult, err := h.Models.Trackers.Insert(tracker)
		if err != nil {
			switch {
			default:
				h.Errors.ServerErrorResponse(w, r, err)
			}
			return
		}
		result = append(result, itemResult)

		/*		inverterTracker := &trackers.InverterTracker{
				InverterId: int64(inverterId),
				TrackerId:  itemResult.ID,
			}*/
		/*
			err = h.Models.Trackers.InsertInverterTracker(inverterTracker)
			if err != nil {
				switch {
				default:
					h.Errors.ServerErrorResponse(w, r, err)
				}
				return
			}*/
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"trackers": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetTrackersByProjectId(w http.ResponseWriter, r *http.Request) {
	/*	bearerHeader := r.Header.Get("Authorization")
		bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)
	*/
	projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
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

	result, err := h.Models.Trackers.GetTrackersByProjectId(projectId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"trackers": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) UpdateTracker(w http.ResponseWriter, r *http.Request) {

	trackerId := chi.URLParam(r, "trackerId")

	var input struct {
		ID      string         `json:"id"`
		Changes boiler.Tracker `json:"changes"`
	}

	err := h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	updateTracker := &boiler.Tracker{
		ID:       trackerId,
		Name:     input.Changes.Name,
		Location: input.Changes.Location,
		Color:    input.Changes.Color,
	}

	result, err := h.Models.Trackers.UpdateTracker(updateTracker)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"tracker": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetTrackersByInverterId(w http.ResponseWriter, r *http.Request) {
	/*	bearerHeader := r.Header.Get("Authorization")
		bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)
	*/
	inverterIdString := chi.URLParam(r, "inverterId")
	inverterId, err := strconv.Atoi(inverterIdString)
	if err != nil {
		h.Logger.PrintError(err, nil)
	}
	//fmt.Println(inverterId)

	/*	idString, err := h.Tokens.GetUserIdFromToken(bearer)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}
		userId, err := strconv.Atoi(idString)*/
	//fmt.Println(userId)

	result, err := h.Models.Trackers.GetTrackersByInverterId(int64(inverterId))
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"trackers": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) DeleteTracker(w http.ResponseWriter, r *http.Request) {
	/*	bearerHeader := r.Header.Get("Authorization")
		bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

		userId, err := h.Tokens.GetUserIdInt64FromToken(bearer)
		if err != nil {
			h.Logger.PrintError(err, nil)
		}*/
	//fmt.Println(userId)

	/*	projectId, err := h.Helpers.GetInt64FromURLParam(chi.URLParam(r, "projectId"))
		if err != nil {
			h.Logger.PrintError(err, nil)
		}*/
	//fmt.Println(projectId)

	trackerId := chi.URLParam(r, "trackerId")

	/*	var input struct {
			ID int64 `json:"id"`
		}

		err := h.Json.DecodeJSON(w, r, &input)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}*/

	err := h.Models.Trackers.Delete(trackerId)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"trackerId": trackerId, "deleted": true},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}
