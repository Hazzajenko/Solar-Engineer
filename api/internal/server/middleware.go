package server

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func (s *Server) Middleware() *chi.Mux {
	// Middleware
	//app.server.Use(middleware.Logger())
	//app.server.Use(middleware.Recover())
	////app.initAuthMiddleware()
	//app.server.Use(middleware.JWTWithConfig(middleware.JWTConfig{
	//	SigningKey:  []byte(app.config.jwt.secretKey),
	//	TokenLookup: "query:token",
	//}))

	// Basic CORS
	// for more ideas, see: https://developer.github.com/v3/#cross-origin-resource-sharing
	s.Router.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	s.Router.Use(middleware.Logger)
	s.Router.Use(middleware.Recoverer)
	return s.Router
	//return http.ListenAndServe("localhost:3000", s.Router)
	/*	// Routes
		e.GET("/users", getAllUsers)
		e.POST("/users", createUser)
		e.GET("/users/:id", getUser)
		e.PUT("/users/:id", updateUser)
		e.DELETE("/users/:id", deleteUser)*/

	// Start server

	//return app.server.Start("localhost:1323")
}
