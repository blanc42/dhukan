package handler

import (
	"net/http"

	"github.com/blanc42/ecms/pkg/routes"
	"github.com/gin-gonic/gin"
)

func MainRouter(w http.ResponseWriter, r *http.Request) {
	router := gin.Default()
	routes.SetupRouter(router)
	router.ServeHTTP(w, r)
}
