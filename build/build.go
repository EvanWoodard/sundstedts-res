package main

import (
	"log"
	"os"
	"os/exec"
)

var libs = []string{"wc", "js", "css", "img", "wcp"}

func main() {
	log.Println("Creating dist folder")
	if _, err := os.Stat("dist"); os.IsNotExist(err) {
		os.Mkdir("dist", os.ModePerm)
	}

	_ = os.Mkdir("dist", os.ModePerm)

	for _, lib := range libs {
		builder := exec.Command("yarn", "run", "build")
		builder.Dir = "src/" + lib

		log.Println("Running yarn build for", lib)
		err := builder.Run()
		if err != nil {
			log.Fatal(err)
		}
		log.Println("Ran yarn build successfully")

		copier := exec.Command("cp", "-a", "dist/.", "../../dist/"+lib)
		copier.Dir = "src/" + lib

		log.Println("Copying", lib, "to dist")
		err = copier.Run()
		if err != nil {
			log.Fatal(err)
		}
		log.Println("Copied", lib, "successfully")
	}
}
