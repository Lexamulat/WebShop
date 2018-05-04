package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	MenuHandlers "shop/handlers"

	"github.com/gorilla/mux"
)

func mainhandler(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("static/html/start.html")
	t.Execute(w, t)
}

func main() {
	router := mux.NewRouter()

	s := http.StripPrefix("/static/", http.FileServer(http.Dir("./static/")))

	router.HandleFunc("/", mainhandler).Methods("GET")
	router.HandleFunc("/BMenu", MenuHandlers.GetBMenu).Methods("POST")

	router.PathPrefix("/static/").Handler(s)

	fmt.Println("test")
	log.Fatal(http.ListenAndServe(":9999", router))

}
