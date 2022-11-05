package json

import (
	"encoding/json"
	"net/http"
)

//func JSON(w http.ResponseWriter, status int, data any) error {
//	return ResponseJSON(w, status, data, nil)
//}

func (j *JSON) ResponseJSON(w http.ResponseWriter, status int, data any, headers http.Header) error {
	js, err := json.MarshalIndent(data, "", "\t")
	if err != nil {
		return err
	}

	js = append(js, '\n')

	for key, value := range headers {
		w.Header()[key] = value
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, _ = w.Write(js)

	return nil
}
