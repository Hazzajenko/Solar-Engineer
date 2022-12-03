package server

import (
	handlers2 "github.com/Hazzajenko/gosolarbackend/cmd/api/handlers"
	"github.com/go-chi/chi/v5"
)

type Server struct {
	Router       *chi.Mux
	Handlers     *handlers2.Handlers
	SocketServer *handlers2.SocketServer
}

func InitServer(router *chi.Mux, handlers *handlers2.Handlers, socketServer *handlers2.SocketServer) Server {
	return Server{Router: router, Handlers: handlers, SocketServer: socketServer}
}
