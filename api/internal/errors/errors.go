package errors

import (
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	"github.com/Hazzajenko/gosolarbackend/internal/logger"
	"net/http"
)

type Errors struct {
	Logger *logger.Logger
	Json   *json.JSON
}

type envelope map[string]any

func InitErrors(logger *logger.Logger, json *json.JSON) Errors {
	return Errors{
		Logger: logger,
		Json:   json,
	}
}

func (errs Errors) logError(r *http.Request, err error) {
	errs.Logger.PrintError(err, map[string]string{
		"request_method": r.Method,
		"request_url":    r.URL.String(),
	})
}

func (errs Errors) errorResponse(w http.ResponseWriter, r *http.Request, status int, message any) {
	env := envelope{"error": message}
	err := errs.Json.ResponseJSON(w, status, env, nil)
	if err != nil {
		errs.logError(r, err)
		w.WriteHeader(500)
	}
}
