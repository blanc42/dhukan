package handler

import (
	"net/http"

	"github.com/blanc42/ecms/pkg/initializers"
	"github.com/blanc42/ecms/pkg/routes"
	"github.com/gin-gonic/gin"
)

func MainRouter(w http.ResponseWriter, r *http.Request) {
	router := gin.Default()
	routes.SetupRouter(router)
	// initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	router.ServeHTTP(w, r)
}
