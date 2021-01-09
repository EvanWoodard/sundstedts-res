package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

const service string = "shared"

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", defaultHandler)
	r.PathPrefix("/js/").Handler(http.StripPrefix("/js/", http.FileServer(http.Dir("dist/js"))))
	r.PathPrefix("/css/").Handler(http.StripPrefix("/css/", http.FileServer(http.Dir("dist/css"))))
	r.PathPrefix("/img/").Handler(http.StripPrefix("/img/", http.FileServer(http.Dir("dist/img"))))
	r.PathPrefix("/wc/").Handler(http.StripPrefix("/wc/", http.FileServer(http.Dir("dist/wc"))))

	c := handlers.AllowedOrigins([]string{"https://evenson.sundstedt.us"})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := &http.Server{
		Addr:         "0.0.0.0:" + port,
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      handlers.CORS(c)(r),
	}

	log.Fatal(srv.ListenAndServe())
}

func defaultHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello CDN"))
}
