package main

import (
	"bufio"
	"database/sql"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
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
	/////////////////////////////////////////////////////////////////////////////////////////////
	// img
	file, err := os.Open("static/images/burg.jpg")
	if err != nil {
		log.Fatal(err)
	}
	//open file
	defer file.Close()
	stat, err := file.Stat() // file size
	if err != nil {
		log.Fatal(err)
	}
	bs := make([]byte, stat.Size())
	// read file into bytes
	buffer := bufio.NewReader(file)
	_, err = buffer.Read(bs) // <--------------- here!

	if err != nil {
		return
	}
	id := 1
	_, err = MenuHandlers.DB.Exec("UPDATE BMenu SET img = ? WHERE id = ?",
		bs, id)

	if err == nil {
		fmt.Println("gud")
	}
	///////////////////////////////////////////
	var name string
	err = db.QueryRow("select img from BMenu where id = ?", 1).Scan(&name)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(name)

	///////////////////////////////////////////////////////////////////////////////////////////
	log.Fatal(http.ListenAndServe(":9999", router))

}
