package data

import (
	"context"
	"database/sql"
	"fmt"
	_ "github.com/jackc/pgconn"
	_ "github.com/jackc/pgx/v4"
	_ "github.com/jackc/pgx/v4/stdlib"
	"time"
)

func InitDB(dsn string) (*sql.DB, error) {
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxIdleTime(5 * time.Minute)
	db.SetConnMaxLifetime(2 * time.Hour)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)
	if err != nil {
		return nil, err
	}

	err = testDB(db)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func testDB(d *sql.DB) error {
	err := d.Ping()

	if err != nil {
		fmt.Println("Error!", err)
		return err
	}

	fmt.Println("*** Pinged database successfully! ***")
	return nil
}
