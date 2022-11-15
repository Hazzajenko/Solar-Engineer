package server

import (
	"fmt"
	"github.com/Hazzajenko/gosolarbackend/internal/websockets"
	"github.com/go-chi/chi/v5"
	"net/http"
)

func (s *Server) Routes() *chi.Mux {
	s.Router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("hello")
	})

	s.Router.Route("/auth", func(r chi.Router) {
		r.Group(func(r chi.Router) {
			r.Post("/register", s.Handlers.RegisterUserHandler)
			r.Post("/login", s.Handlers.LoginUserHandler)
		})

		//r.Get("/{AssetUrl}", GetAsset)
		//r.Get("/manage/url/{path}", FetchAssetDetailsByURL)
		//r.Get("/manage/id/{path}", FetchAssetDetailsByID)
	})
	/*	s.Router.Group(func(r chi.Router) {
		r.Post("/register", s.Handlers.RegisterUserHandler)
		//r.Get("/{AssetUrl}", GetAsset)
		//r.Get("/manage/url/{path}", FetchAssetDetailsByURL)
		//r.Get("/manage/id/{path}", FetchAssetDetailsByID)
	})*/

	s.Router.Get("/ws", s.Handlers.WsEndpoint)
	s.Router.Get("/echo", websockets.Echo)

	s.Router.Route("/projects", func(r chi.Router) {

		r.Group(func(r chi.Router) {
			r.Get("/", s.Handlers.GetUserProjects)
			r.Post("/", s.Handlers.CreateProject)
			r.Put("/", s.Handlers.AddUserToProject)
		})

		r.Route("/{projectId}", func(r chi.Router) {
			r.Get("/", s.Handlers.GetProjectById)
			r.Get("/all", s.Handlers.GetDataForProject)

			r.Group(func(r chi.Router) {
				r.Get("/inverters", s.Handlers.GetInvertersByProjectId)
				r.Post("/inverters", s.Handlers.CreateInverter)
				r.Delete("/inverters", s.Handlers.DeleteInverter)
			})

			r.Group(func(r chi.Router) {
				r.Get("/trackers", s.Handlers.GetTrackersByProjectId)
				r.Delete("/trackers", s.Handlers.DeleteTracker)
			})

			r.Group(func(r chi.Router) {
				r.Get("/strings", s.Handlers.GetStringsByProjectId)
				r.Post("/strings", s.Handlers.CreateString)
				r.Patch("/strings", s.Handlers.UpdateString)
				r.Post("/strings/color", s.Handlers.UpdateStringColor)
				r.Delete("/strings", s.Handlers.DeleteString)
			})

			r.Group(func(r chi.Router) {
				r.Get("/panels", s.Handlers.GetPanelsByProjectId)
				r.Post("/panels", s.Handlers.CreatePanel)
				r.Patch("/panels", s.Handlers.UpdatePanelLocation)
				r.Delete("/panels", s.Handlers.DeletePanel)
			})

			r.Route("/{inverterId}", func(r chi.Router) {
				r.Get("/", s.Handlers.GetTrackersByInverterId)
				r.Post("/", s.Handlers.CreateTracker)

				r.Route("/{trackerId}", func(r chi.Router) {

					r.Route("/{stringId}", func(r chi.Router) {
						r.Post("/", s.Handlers.CreatePanel)

					})
				})

			})
		})
	})
	return s.Router
	// Public Routes
	/*	s.Router.Group(func(r chi.Router) {
		r.Get("/", s.Handlers.RegisterUserHandler)
		//r.Get("/{AssetUrl}", GetAsset)
		//r.Get("/manage/url/{path}", FetchAssetDetailsByURL)
		//r.Get("/manage/id/{path}", FetchAssetDetailsByID)
	})*/
}
