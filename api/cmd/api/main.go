package main

import (
	handlers2 "github.com/Hazzajenko/gosolarbackend/cmd/api/handlers"
	"github.com/Hazzajenko/gosolarbackend/internal/data"
	errors2 "github.com/Hazzajenko/gosolarbackend/internal/errors"
	helpers2 "github.com/Hazzajenko/gosolarbackend/internal/helpers"
	json2 "github.com/Hazzajenko/gosolarbackend/internal/json"
	"github.com/Hazzajenko/gosolarbackend/internal/logger"
	server2 "github.com/Hazzajenko/gosolarbackend/internal/server"
	tokens2 "github.com/Hazzajenko/gosolarbackend/internal/tokens"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
)

type config struct {
	addr string
	env  string
	db   struct {
		dsn          string
		maxOpenConns int
		maxIdleConns int
		maxIdleTime  string
		automigrate  bool
	}
	jwt struct {
		secretKey string
	}
	cors struct {
		trustedOrigins []string
	}
	version bool
}

type application struct {
	config   config
	server   *server2.Server
	router   *chi.Mux
	logger   *logger.Logger
	models   data.Models
	handlers *handlers2.Handlers
}

func main() {

	customLogger := logger.New(os.Stdout, logger.LevelInfo, true)
	customLogger.PrintInfo("helsadfs", nil)
	err := godotenv.Load()
	if err != nil {
		customLogger.PrintError(err, nil)
	}
	dsn := os.Getenv("DB_DSN")
	key := os.Getenv("JWT_SECRET")
	//customLogger.PrintInfo(one, nil)
	//customLogger.PrintInfo(two, nil)
	r := chi.NewRouter()

	//dsn := getDSN()
	customLogger.PrintInfo(dsn, nil)
	db, err := data.InitDB(dsn)
	if err != nil {
		customLogger.PrintError(err, nil)
	}
	models := data.InitModels(db)
	json := json2.InitJSON()
	errors := errors2.InitErrors(customLogger, &json)
	//key := "pei3einoh0Beem6uM6Ungohn2heiv5lah1ael4joopie5JaigeikoozaoTew2Eh6"
	tokens := tokens2.InitTokens(key)
	helpers := helpers2.InitHelpers()
	handlers := handlers2.InitHandlers(models, customLogger, &tokens, &json, &errors, &helpers)

	server := server2.InitServer(r, &handlers)
	server.Middleware()
	server.Routes()

	app := &application{
		router:   r,
		server:   &server,
		handlers: &handlers,
		logger:   customLogger,
	}

	app.logger.PrintInfo("database connection pool established", nil)

	err, done := app.initConfig()
	if !done {
		return
	}

	// Websockets
	log.Println("Starting channel listener")
	go handlers2.ListenToWsChannel()

	err = http.ListenAndServe("localhost:3000", server.Router)
	if err != nil {
		app.logger.PrintFatal(err, map[string]string{"db": "error starting server"})
	}

	// GRPC
	// lis, err := net.Listen("tcp", "localhost:50051")
	app.logger.PrintInfo("Server stopped", nil)

}
