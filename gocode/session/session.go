package session

import (
	"fmt"
	"net/http"
	DataBase "shop/gocode/db"
	MyRand "shop/gocode/myrand"
	"time"
)

func GenerateSessionID() string {
	ses, err := MyRand.GenerateRandomString(256)
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	fmt.Println("---generated ses---")
	fmt.Println(ses)
	fmt.Println("-------------------")
	return ses
}

func SetMyCook(w http.ResponseWriter, login string) {
	var cook http.Cookie
	cook.Name = "mycook"
	cook.Value = GenerateSessionID()
	cook.Path = "/"
	cook.Expires = time.Now().Add(20 * time.Minute)

	_, err := DataBase.DB.Exec("UPDATE ClientsData SET session = ? WHERE log=?",
		cook.Value, login)
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	fmt.Println("the cook was sent for 20 minutes")
	http.SetCookie(w, &cook)
}

//!TODO Need to chek for errors
