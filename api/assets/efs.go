package assets

import (
	"embed"
)

//go:embed "migrations"
var EmbeddedFiles embed.FS
