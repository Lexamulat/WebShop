package session

import (
	"fmt"
	"net/http"
	MyRand "shop/gocode/myrand"
	"time"
)

func StartSession() string {
	ses, err := MyRand.GenerateRandomString(256)
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	return ses
}

func SetMyCook(w http.ResponseWriter) {
	var cook http.Cookie
	cook.Name = "mycook2"
	cook.Value = "ses"
	cook.Path = "/"
	cook.Expires = time.Now().Add(20 * time.Minute)
	fmt.Println("the cook was sent for 20 minutes")
	http.SetCookie(w, &cook)
}

//!TODO Need to chek for errors
