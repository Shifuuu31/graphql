package main

import (
	"log"
	"net/http"
	"os"
)

func router() http.Handler {
	mux := http.NewServeMux()

	// Serve ONLY the "assets" directory under /assets/
	public := http.StripPrefix("/public/", http.FileServer(http.Dir("./public")))
	mux.Handle("/public/", public)

	// Serve the HTML file on root
	mux.HandleFunc("/", home)

	return mux
	// return app.Rl.RLMiddleware(app.authMiddleware(mux))
}

func main() {
	port := ":" + os.Getenv("PORT")
	if port == ":" {
		port += "8080"
	}
	server := http.Server{
		Addr:    port,
		Handler: router(),
	}

	log.Println("server listening on http://localhost" + port)

	if err := server.ListenAndServe(); err != nil {
		log.Fatalln(err)
	}
}

func home(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./index.html")
}
