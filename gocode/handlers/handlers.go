package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	DataBase "shop/gocode/db"
	Session "shop/gocode/session"
	SupportPackage "shop/gocode/support"
	"strconv"

	"github.com/buger/jsonparser"
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

func BurgAdd(w http.ResponseWriter, r *http.Request) {
	bodyBytes, _ := ioutil.ReadAll(r.Body)

	name, err := jsonparser.GetString(bodyBytes, "name")
	if err != nil {
		fmt.Println("err name")
	}
	description, err := jsonparser.GetString(bodyBytes, "description")
	if err != nil {
		fmt.Println("err desc")
	}
	picture, err := jsonparser.GetString(bodyBytes, "picture")
	if err != nil {
		fmt.Println("err pict")
	}
	fmt.Println("init")
	fmt.Println(err, name, description, picture)
	// result, err := DataBase.DB.Exec("INSERT INTO BMenu (name,description,imgPath) VALUES(?,?,?)", idsubcat, name_mod, price, description, picture)
	// affected := int64(0)
	// if err == nil {

	// 	affected, _ = result.RowsAffected()
	// }

	// fmt.Fprintf(w, strconv.Itoa(int(affected)))

}

func Edit(w http.ResponseWriter, r *http.Request) {

	bodyBytes, _ := ioutil.ReadAll(r.Body)

	id, err := jsonparser.GetInt(bodyBytes, "id")
	if err != nil {
		fmt.Println("err id")

	}
	name, err := jsonparser.GetString(bodyBytes, "name")
	if err != nil {
		fmt.Println("err name")
	}
	description, err := jsonparser.GetString(bodyBytes, "description")
	if err != nil {
		fmt.Println("err desc")
	}
	picture, err := jsonparser.GetString(bodyBytes, "picture")
	if err != nil {
		fmt.Println("err pict")
	}
	// coI := strings.Index(string(picture), ",") //eraise  from data:image/jpeg;base64,/9j/4AAQSkZJRgAB.....
	// cutstr := string(picture)[coI+1:]          // @data:image/jpeg;base64,@
	// // cutstr := picture[23:] the other way to eraise @data:image/jpeg;base64,@
	// // fmt.Println(picture)
	// unbased, err := base64.StdEncoding.DecodeString(cutstr)
	// if err != nil {
	// 	fmt.Println("err with decode")
	// 	log.Fatal(err)

	// }
	// res := bytes.NewReader(unbased)
	// jpgI, err := jpeg.Decode(res)
	// if err != nil {
	// 	fmt.Println("err with decode")
	// 	log.Fatal(err)

	// }
	// //generate random name for img
	// generatedImgName, err := MyRand.GenerateRandomString(16)

	// if err != nil {
	// 	fmt.Println(err)
	// 	os.Exit(1)
	// }
	// imgPath := "static/images/" + generatedImgName + ".jpg"
	// out, err := os.Create(imgPath)

	// if err != nil {
	// 	fmt.Println(err)

	// }
	// var opt jpeg.Options
	// opt.Quality = 100
	// //  write out the data into the new JPEG file

	// err = jpeg.Encode(out, jpgI, &opt)
	// if err != nil {
	// 	fmt.Println(err)

	// }

	imgPath, err := SupportPackage.SaveImg(picture)
	if err != nil {
		fmt.Println(err)

	}
	fmt.Println(name, description, imgPath, id)
	result, err := DataBase.DB.Exec("UPDATE BMenu SET name=?, description=? , imgPath=?  WHERE id=?",
		name, description, imgPath, strconv.Itoa(int(id)))
	affected := int64(0)
	if err == nil {
		affected, _ = result.RowsAffected()
	}
	fmt.Fprintf(w, strconv.Itoa(int(affected)))
	// /static/images/bigtasty.jpg
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
