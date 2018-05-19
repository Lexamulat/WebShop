package db

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func ConnectWithDB() {
	var err error

	DB, err = sql.Open("sqlite3", "./shop.db")
	if err != nil {
		log.Fatal(err)
	}
}
