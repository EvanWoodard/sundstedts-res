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
	r.PathPrefix("/js-req/").Handler(http.StripPrefix("/js-req/", http.FileServer(http.Dir("js-req"))))
	r.PathPrefix("/no-js/").Handler(http.StripPrefix("/no-js/", http.FileServer(http.Dir("no-js"))))

	srv := &http.Server{
		Addr:         "0.0.0.0:8080",
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      r,
	}

	log.Fatal(srv.ListenAndServe())
}
