package handlers

import (
	"fmt"
	"html/template"
	"net/http"
)

func GetBMenu(w http.ResponseWriter, r *http.Request) {
	fmt.Println("BMenu")
	t, _ := template.ParseFiles("static/html/start.html")
	t.Execute(w, t)
}
