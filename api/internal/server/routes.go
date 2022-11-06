package server

import (
	"fmt"
	"github.com/go-chi/chi/v5"
	"net/http"
)

func (s *Server) Routes() *chi.Mux {
	s.Router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("hello")
	})

	s.Router.Route("/auth", func(r chi.Router) {
		r.Post("/register", s.Handlers.RegisterUserHandler)
		r.Post("/login", s.Handlers.LoginUserHandler)
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

	s.Router.Route("/projects", func(r chi.Router) {
		r.Get("/", s.Handlers.GetUserProjects)
		r.Post("/", s.Handlers.CreateProject)
		r.Put("/", s.Handlers.AddUserToProject)

		r.Route("/{projectId}", func(r chi.Router) {
			r.Get("/", s.Handlers.GetProjectById)
			r.Get("/all", s.Handlers.GetDataForProject)
			r.Get("/inverters", s.Handlers.GetInvertersByProjectId)
			r.Get("/trackers", s.Handlers.GetTrackersByProjectId)
			r.Get("/strings", s.Handlers.GetStringsByProjectId)
			r.Post("/", s.Handlers.CreateInverter)

			r.Route("/{inverterId}", func(r chi.Router) {
				r.Get("/", s.Handlers.GetTrackersByInverterId)
				r.Post("/", s.Handlers.CreateTracker)

				r.Route("/{trackerId}", func(r chi.Router) {
					r.Post("/", s.Handlers.CreateString)

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
