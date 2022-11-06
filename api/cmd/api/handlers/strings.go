package handlers

import (
	"fmt"
	stringModels "github.com/Hazzajenko/gosolarbackend/internal/data/models/strings"
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	"github.com/go-chi/chi/v5"
	"net/http"
	"strconv"
	"strings"
)

func (h *Handlers) CreateString(w http.ResponseWriter, r *http.Request) {
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

	var input struct {
		Name         string `json:"name"`
		IsInParallel bool   `json:"isInParallel"`
	}

	err = h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	stringModel := &stringModels.String{
		ProjectId:    int64(projectId),
		InverterId:   int64(inverterId),
		TrackerId:    int64(trackerId),
		Name:         input.Name,
		CreatedBy:    int64(userId),
		IsInParallel: input.IsInParallel,
		PanelAmount:  0,
	}

	result, err := h.Models.Strings.Insert(stringModel)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}
	//result = append(result, itemResult)

	trackerString := &stringModels.TrackerString{
		TrackerId: int64(trackerId),
		StringId:  result.ID,
	}

	err = h.Models.Strings.InsertTrackerString(trackerString)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	/*file, err := os.ReadFile("assets/json/trackers/tauroeco100-3-d.json")
	var data []trackers.Tracker
	var result []*trackers.Tracker

	//data := inverters.Inverter{}
	_ = json2.Unmarshal([]byte(file), &data)
	for index, item := range data {
		tracker := &trackers.Tracker{
			ProjectId:              int64(projectId),
			InverterId:             int64(inverterId),
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

		inverterTracker := &trackers.InverterTracker{
			InverterId: int64(inverterId),
			TrackerId:  itemResult.ID,
		}

		err = h.Models.Trackers.InsertInverterTracker(inverterTracker)
		if err != nil {
			switch {
			default:
				h.Errors.ServerErrorResponse(w, r, err)
			}
			return
		}
	}*/

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"strings": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetStringsByProjectId(w http.ResponseWriter, r *http.Request) {
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
