package main

import (
	"database/sql"
	"fmt"
	"html/template"
	"log"
	"net/http"
	MenuHandlers "shop/gocode/handlers"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
)

func mainhandler(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("static/html/start.html")
	t.Execute(w, t)
}

func main() {
	var err error

	MenuHandlers.DB, err = sql.Open("sqlite3", "./shop.db")
	if err != nil {
		log.Fatal(err)
	}
	defer MenuHandlers.DB.Close()

	router := mux.NewRouter()

	s := http.StripPrefix("/static/", http.FileServer(http.Dir("./static/")))

	router.HandleFunc("/", mainhandler).Methods("GET")
	router.HandleFunc("/BMenu", MenuHandlers.GetBMenu).Methods("POST")

	router.PathPrefix("/static/").Handler(s)

	fmt.Println("test")
	log.Fatal(http.ListenAndServe(":9999", router))

}
