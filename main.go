package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

const service string = "shared"

func main() {
	r := mux.NewRouter()
	r.PathPrefix("/js/").Handler(http.StripPrefix("/js/", http.FileServer(http.Dir("dist/js"))))
	r.PathPrefix("/css/").Handler(http.StripPrefix("/css/", http.FileServer(http.Dir("dist/css"))))
	r.PathPrefix("/wc/").Handler(http.StripPrefix("/wc/", http.FileServer(http.Dir("dist/wc"))))

	srv := &http.Server{
		Addr:         "0.0.0.0:8080",
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      r,
	}

	log.Fatal(srv.ListenAndServe())
}
