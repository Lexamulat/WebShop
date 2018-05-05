package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

var DB *sql.DB

type BMenuStruct struct { //variables must begin with a capital
	//letter, otherwise they can not be exported to main.go client(undifined)
	Id          int    `json:"Id"`
	Name        string `json:"Name"`
	Description string `json:"Description"`
}

func GetBMenu(w http.ResponseWriter, r *http.Request) {

	rows, err := DB.Query("select * from BMenu")
	if err != nil {
		log.Fatal(err)
	}
	el := []BMenuStruct{}
	var temp BMenuStruct
	for rows.Next() {
		rows.Scan(&temp.Id, &temp.Name, &temp.Description)
		el = append(el, temp)
	}
	outJSON, _ := json.Marshal(el)
	fmt.Fprintf(w, string(outJSON))

}
