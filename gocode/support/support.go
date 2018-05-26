package support

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image/jpeg"
	"log"
	"os"
	MyRand "shop/gocode/myrand"
	"strings"
)

func SaveImg(picture string) (string, error) {
	coI := strings.Index(string(picture), ",") //eraise  from data:image/jpeg;base64,/9j/4AAQSkZJRgAB.....
	cutstr := string(picture)[coI+1:]          // @data:image/jpeg;base64,@
	// cutstr := picture[23:] the other way to eraise @data:image/jpeg;base64,@
	// fmt.Println(picture)
	unbased, err := base64.StdEncoding.DecodeString(cutstr)
	if err != nil {
		fmt.Println("err with base 64decode")
		// TODO sometimes @illegal base64 data at input byte 30@
		return "zero", err
	}
	res := bytes.NewReader(unbased)
	jpgI, err := jpeg.Decode(res)
	if err != nil {
		fmt.Println("err with reader")
		log.Fatal(err)

	}
	//generate random name for img
	generatedImgName, err := MyRand.GenerateRandomString(16)

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	imgPath := "static/images/" + generatedImgName + ".jpg"
	out, err := os.Create(imgPath)

	if err != nil {
		fmt.Println(err)

	}
	var opt jpeg.Options
	opt.Quality = 100
	//  write out the data into the new JPEG file

	err = jpeg.Encode(out, jpgI, &opt)
	if err != nil {
		fmt.Println("err with Encode")
		fmt.Println(err)

	}
	return imgPath, err
}
