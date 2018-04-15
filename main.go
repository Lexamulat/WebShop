package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
)

func mainhandler(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("static/start.html")
	t.Execute(w, t)
}

func main() {

	fmt.Println("test")
	http.HandleFunc("/", mainhandler)
	log.Fatal(http.ListenAndServe(":9999", nil))
}
