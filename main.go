package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	Mh "shop/handlers"

	"github.com/gorilla/mux"
)

func mainhandler(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("static/html/start.html")
	t.Execute(w, t)
}
func Test(w http.ResponseWriter, r *http.Request) {
	fmt.Println("BMenu")
}

func main() {
	router := mux.NewRouter()

	s := http.StripPrefix("/static/", http.FileServer(http.Dir("./static/")))
	// router.HandleFunc("/BMenu", Test).Methods("POST")
	//почему важно расположение функции??
	router.HandleFunc("/BMenu", Mh.GetBMenu).Methods("POST")

	router.PathPrefix("/static/").Handler(s)

	router.HandleFunc("/", mainhandler).Methods("GET")

	fmt.Println("test")
	log.Fatal(http.ListenAndServe(":9999", router))

}
