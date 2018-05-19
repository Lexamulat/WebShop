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
	tmpl, _ := template.ParseGlob("static/html/*.html")
	err := tmpl.ExecuteTemplate(w, "start.html", nil)
	if err != nil {
		panic(err)
	}
}

func AdminPanel(w http.ResponseWriter, r *http.Request) {

	fmt.Println("init")

	_, err := r.Cookie("mycook2")

	w.Header().Set("Cache-Control", "no-cache") //disable cache redirect

	if err != nil {
		http.Redirect(w, r, "/log", 301)
	} else {
		t, _ := template.ParseFiles("static/html/redact.html")
		t.Execute(w, t)
	}

}

func GetCook(w http.ResponseWriter, r *http.Request) {
	var cook http.Cookie
	cook.Name = "mycook2"
	cook.Value = "val2"
	cook.Path = "/"
	http.SetCookie(w, &cook)
	// fmt.Println(r.PostFormValue("log"))
	// fmt.Println(r.PostFormValue("pass"))

}

//take care of chrome cash

func Log(w http.ResponseWriter, r *http.Request) {

	t, _ := template.ParseFiles("static/html/log.html")
	t.Execute(w, t)
}

func main() {
	var err error

	MenuHandlers.DB, err = sql.Open("sqlite3", "./shop.db")
	if err != nil {
		log.Fatal(err)
	}

	router := mux.NewRouter()

	s := http.StripPrefix("/static/", http.FileServer(http.Dir("./static/")))

	router.HandleFunc("/", mainhandler).Methods("GET")
	router.HandleFunc("/BMenu", MenuHandlers.GetBMenu).Methods("POST")
	router.HandleFunc("/red", AdminPanel)
	router.HandleFunc("/log", Log)
	router.HandleFunc("/gc", GetCook)

	router.PathPrefix("/static/").Handler(s)

	fmt.Println("test")
	log.Fatal(http.ListenAndServe(":9999", router))
	/////////////////////////////////////////////////
	// 1)Get img.jpg from folder.
	// 2)Save in db.
	// 3)Get from db.
	// 4)Save in folder
	// //////////////////////////////////////////////
	// // img
	// file, err := os.Open("static/images/burg.jpg")
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// //open file
	// defer file.Close()
	// stat, err := file.Stat() // file size
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// bs := make([]byte, stat.Size())
	// // read file into bytes
	// buffer := bufio.NewReader(file)
	// _, err = buffer.Read(bs) // <--------------- here!

	// if err != nil {
	// 	return
	// }
	// id := 1
	// _, err = MenuHandlers.DB.Exec("UPDATE BMenu SET img = ? WHERE id = ?",
	// 	bs, id)

	// if err == nil {
	// 	fmt.Println("gud")
	// }
	// ///////////////////////////////////////////
	// var name string
	// err = MenuHandlers.DB.QueryRow("select img from BMenu where id = ?", 1).Scan(&name)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// //////////////////////////////////////////

	// bs2 := []byte(name)
	// id = 2
	// _, err = MenuHandlers.DB.Exec("UPDATE BMenu SET img = ? WHERE id = ?",
	// 	bs2, id)

	// if err == nil {
	// 	fmt.Println("gud")
	// }
	// ////////////////////////////////////////
	// r := bytes.NewReader(bs2)
	// img, _, _ := image.Decode(r)

	// //save the imgByte to file
	// out, err := os.Create("./myimg.jpg")

	// if err != nil {
	// 	fmt.Println(err)
	// 	os.Exit(1)
	// }
	// var opt jpeg.Options
	// opt.Quality = 100
	// // ok, write out the data into the new JPEG file

	// err = jpeg.Encode(out, img, &opt)
	// if err != nil {
	// 	fmt.Println(err)
	// 	os.Exit(1)
	// }
	// ///////////////////////////////////////////////////////////

}
