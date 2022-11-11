package handlers

import (
	"github.com/Hazzajenko/gosolarbackend/internal/data"
	"github.com/Hazzajenko/gosolarbackend/internal/errors"
	"github.com/Hazzajenko/gosolarbackend/internal/helpers"
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	"github.com/Hazzajenko/gosolarbackend/internal/logger"
	"github.com/Hazzajenko/gosolarbackend/internal/tokens"
)

type Handlers struct {
	Models  data.Models
	Logger  *logger.Logger
	Tokens  *tokens.Tokens
	Json    *json.JSON
	Errors  *errors.Errors
	Helpers *helpers.Helpers
	//Errors
	//Helpers
	//Tokens
}

func InitHandlers(models data.Models, logger *logger.Logger, tokens *tokens.Tokens, json *json.JSON, errors *errors.Errors, helpers *helpers.Helpers) Handlers {
	return Handlers{
		Models:  models,
		Logger:  logger,
		Tokens:  tokens,
		Json:    json,
		Errors:  errors,
		Helpers: helpers,
	}
}
