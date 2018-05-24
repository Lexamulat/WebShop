package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	DataBase "shop/gocode/db"
	Session "shop/gocode/session"
)

type BMenuStruct struct { //variables must begin with a capital
	//letter, otherwise they can not be exported to main.go client(undifined)
	ID          int    `json:"Id"`
	Name        string `json:"Name"`
	Description string `json:"Description"`
	ImgPath     string `json:"ImgPath"`
}

func GetBMenu(w http.ResponseWriter, r *http.Request) {

	rows, err := DataBase.DB.Query("select * from BMenu")
	if err != nil {
		log.Fatal(err)
	}
	el := []BMenuStruct{}
	var temp BMenuStruct
	for rows.Next() {
		rows.Scan(&temp.ID, &temp.Name, &temp.Description, &temp.ImgPath)
		el = append(el, temp)
	}
	outJSON, _ := json.Marshal(el)
	fmt.Fprintf(w, string(outJSON))

}
func Test(w http.ResponseWriter, r *http.Request) {
	tmpl, _ := template.ParseGlob("static/html/*.html")
	err := tmpl.ExecuteTemplate(w, "test.html", nil)
	if err != nil {
		panic(err)
	}

}
func Mainhandler(w http.ResponseWriter, r *http.Request) {
	tmpl, _ := template.ParseGlob("static/html/*.html")
	err := tmpl.ExecuteTemplate(w, "start.html", nil)
	if err != nil {
		panic(err)
	}
}

func AdminPanel(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "no-cache") //disable cache redirect
	cook, err := r.Cookie("mycook")
	if err != nil {
		http.Redirect(w, r, "/log", 301)
	} else {

		var session string
		err = DataBase.DB.QueryRow("select session from ClientsData where session = ?", cook.Value).Scan(&session)
		if err == sql.ErrNoRows {
			fmt.Println("session received from cookie dont found in db")
			http.Redirect(w, r, "/log", 302)
		} else {
			tmpl, _ := template.ParseGlob("static/html/*.html")
			err := tmpl.ExecuteTemplate(w, "redact.html", nil)
			if err != nil {
				panic(err)
			}
		}
	}

}

//take care of chrome cash cache

func Log(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		t, _ := template.ParseFiles("static/html/log.html")
		t.Execute(w, t)
	} else {
		login := r.PostFormValue("log")
		pass := r.PostFormValue("pass")

		//!TODO need to hash this data

		var session string
		err := DataBase.DB.QueryRow("select session from ClientsData where log = ? AND pass=?", login, pass).Scan(&session)
		if err != nil {
			if err == sql.ErrNoRows {
				fmt.Println("incorrect log or pass")
				http.Redirect(w, r, "/log", 302)
			} else {
				log.Fatal(err)
			}
		}

		Session.SetMyCook(w, login)
		http.Redirect(w, r, "/red", 302)
	}
}
