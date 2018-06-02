package main

import (
	"fmt"
	"log"
	"net/http"
	DataBase "shop/gocode/db"
	Handlers "shop/gocode/handlers"

	"github.com/gorilla/mux"
)

func main() {
	DataBase.ConnectWithDB()

	router := mux.NewRouter()

	s := http.StripPrefix("/static/", http.FileServer(http.Dir("./static/")))

	router.HandleFunc("/", Handlers.Mainhandler).Methods("GET")
	router.HandleFunc("/BMenu", Handlers.GetBMenu).Methods("POST")
	router.HandleFunc("/red", Handlers.AdminPanel)
	router.HandleFunc("/log", Handlers.Log)
	router.HandleFunc("/edit", Handlers.Edit)
	router.HandleFunc("/basket", Handlers.Basket)
	router.HandleFunc("/getOrder", Handlers.GetOrder)
	router.HandleFunc("/test", Handlers.Test)

	router.HandleFunc("/BurgAdd", Handlers.BurgAdd).Methods("POST")
	router.HandleFunc("/BurgDel", Handlers.BurgDel).Methods("POST")

	router.PathPrefix("/static/").Handler(s)

	fmt.Println("test")
	log.Fatal(http.ListenAndServe(":8080", router))
	/////////////////////////////////////////////////
	// 1)Get img.jpg from folder.
	// 2)Save in db.
	// 3)Get from db.
	// 4)Save in folderёё
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
