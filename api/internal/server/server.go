package server

import (
	handlers2 "github.com/Hazzajenko/gosolarbackend/cmd/api/handlers"
	"github.com/go-chi/chi/v5"
)

type Server struct {
	Router   *chi.Mux
	Handlers *handlers2.Handlers
}

func InitServer(router *chi.Mux, handlers *handlers2.Handlers) Server {
	return Server{Router: router, Handlers: handlers}
}
