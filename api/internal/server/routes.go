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
	//s.Router.Get("/echo", websockets.Echo)

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
				r.Post("/inverter", s.Handlers.CreateInverter)
				r.Put("/inverter/{inverterId}", s.Handlers.UpdateInverter)
				r.Delete("/inverter/{inverterId}", s.Handlers.DeleteInverter)
			})

			r.Group(func(r chi.Router) {
				r.Get("/trackers", s.Handlers.GetTrackersByProjectId)
				r.Post("/tracker", s.Handlers.CreateTracker)
				r.Put("/tracker/{trackerId}", s.Handlers.UpdateTracker)
				r.Delete("/tracker/{trackerId}", s.Handlers.DeleteTracker)
			})

			r.Group(func(r chi.Router) {
				r.Get("/strings", s.Handlers.GetStringsByProjectId)
				r.Post("/string", s.Handlers.CreateString)
				r.Put("/string/{stringId}", s.Handlers.UpdateStringColor)
				r.Delete("/string/{stringId}", s.Handlers.DeleteString)
			})

			r.Group(func(r chi.Router) {
				r.Get("/panels", s.Handlers.GetPanelsByProjectId)
				r.Post("/panel", s.Handlers.CreatePanel)
				//r.Post("/panels", s.Handlers.CreatePanel)
				//r.Patch("/panels", s.Handlers.UpdatePanelLocation)
				r.Put("/panel/{panelId}", s.Handlers.PutPanel)
				r.Delete("/panel/{panelId}", s.Handlers.DeletePanel)
			})

			r.Group(func(r chi.Router) {
				r.Get("/cables", s.Handlers.GetCablesByProjectId)
				r.Post("/cable", s.Handlers.CreateCable)
				r.Put("/cable/{cableId}", s.Handlers.UpdateCable)
				r.Put("/cables", s.Handlers.UpdateManyCables)
				//r.Put("/cables", s.Handlers.UpdateCable)
				r.Delete("/cable/{cableId}", s.Handlers.DeleteCable)
			})

			r.Group(func(r chi.Router) {
				r.Get("/joins", s.Handlers.GetJoinsByProjectId)
				r.Post("/join", s.Handlers.CreateJoin)
				r.Put("/join/{joinId}", s.Handlers.UpdateJoin)
				r.Put("/join/{joinId}/cables", s.Handlers.UpdateManyCables)
				//r.Put("/cables", s.Handlers.UpdateCable)
				r.Delete("/join/{joinId}", s.Handlers.DeleteJoin)
			})

			r.Group(func(r chi.Router) {
				r.Get("/panel-joins", s.Handlers.GetPanelJoinsByProjectId)
				r.Post("/panel-join", s.Handlers.CreatePanelJoin)
				r.Put("/panel-join/{panelJoinId}", s.Handlers.UpdatePanelJoin)
				r.Delete("/panel-join/{panelJoinId}", s.Handlers.DeletePanelJoin)
			})

			r.Group(func(r chi.Router) {
				r.Get("/disconnection-points", s.Handlers.GetDisconnectionPointsByProjectId)
				r.Post("/disconnection-point", s.Handlers.CreateDisconnectionPoint)
				r.Put("/disconnection-point/{disconnectionPointId}", s.Handlers.UpdateDisconnectionPoint)
				r.Delete("/disconnection-point/{disconnectionPointId}", s.Handlers.DeleteDisconnectionPoint)
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
