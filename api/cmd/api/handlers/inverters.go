package handlers

import (
	json2 "encoding/json"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/inverters"
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	"github.com/go-chi/chi/v5"
	"net/http"
	"os"
	"strconv"
	"strings"
)

func (h *Handlers) CreateInverter(w http.ResponseWriter, r *http.Request) {
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
	//fmt.Println(projectId)

	file, err := os.ReadFile("assets/json/inverters/tauroeco100-3-d.json")
	data := inverters.Inverter{}
	_ = json2.Unmarshal([]byte(file), &data)
	h.Logger.PrintInfo(data.Name, nil)

	inverter := &inverters.Inverter{
		ProjectId:           int64(projectId),
		Name:                data.Name,
		CreatedBy:           int64(userId),
		TrackerAmount:       data.TrackerAmount,
		AcNominalOutput:     data.AcNominalOutput,
		AcOutputCurrent:     data.AcOutputCurrent,
		EuropeanEfficiency:  data.EuropeanEfficiency,
		MaxInputCurrent:     data.MaxInputCurrent,
		MaxOutputPower:      data.MaxOutputPower,
		MppVoltageRangeLow:  data.MppVoltageRangeLow,
		MppVoltageRangeHigh: data.MppVoltageRangeHigh,
		StartUpVoltage:      data.StartUpVoltage,
	}

	result, err := h.Models.Inverters.Insert(inverter)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	projectInverter := &inverters.ProjectInverter{
		ProjectId:  int64(projectId),
		InverterId: result.ID,
	}

	err = h.Models.Inverters.InsertProjectInverter(projectInverter)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"inverter": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) GetInvertersByProjectId(w http.ResponseWriter, r *http.Request) {
	/*	bearerHeader := r.Header.Get("Authorization")
		bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)*/

	projectIdString := chi.URLParam(r, "projectId")
	projectId, err := strconv.Atoi(projectIdString)
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

	result, err := h.Models.Inverters.GetInvertersByProjectId(int64(projectId))
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"inverters": result},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

func (h *Handlers) DeleteInverter(w http.ResponseWriter, r *http.Request) {
	//bearerHeader := r.Header.Get("Authorization")
	//bearer := strings.Replace(bearerHeader, "Bearer ", "", 1)

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
		ID int64 `json:"id"`
	}

	err := h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	err = h.Models.Inverters.Delete(input.ID)
	if err != nil {
		switch {
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	err = h.Json.ResponseJSON(w, http.StatusAccepted,
		json.Envelope{"inverter": input.ID, "deleted": true},
		nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}
