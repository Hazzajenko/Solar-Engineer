package main

import (
	"fmt"
	"github.com/fsnotify/fsnotify"
	"github.com/spf13/viper"
)

func getDSN() string {
	return "postgres://postgres:password@localhost/solarbackend?sslmode=disable"
}

func (app *application) initConfig() (error, bool) {
	viper.SetConfigName(".config")
	viper.SetConfigType("yml")
	viper.AddConfigPath(".")

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			err := viper.SafeWriteConfigAs(".config.yml")
			if err != nil {
				return err, false
			}
		} else {
			// Config file was found but another error was produced
			return err, false
		}
	}
	viper.OnConfigChange(func(e fsnotify.Event) {
		fmt.Println("Config file changed:", e.Name)
	})
	viper.WatchConfig()
	dsn := viper.Get("DB_DSN")
	secret := viper.Get("JWT_SECRET")
	if dsn == nil {
		viper.Set("DB_DSN", "postgres://postgres:password@localhost/solarbackend?sslmode=disable")
		err := viper.WriteConfig()
		if err != nil {
			return err, false
		}
	}

	app.config.db.dsn = fmt.Sprintf("%v", dsn)
	if secret == nil {
		viper.Set("JWT_SECRET", "pei3einoh0Beem6uM6Ungohn2heiv5lah1ael4joopie5JaigeikoozaoTew2Eh6")
		err := viper.WriteConfig()
		if err != nil {
			return err, false
		}
	}

	return nil, true
}
