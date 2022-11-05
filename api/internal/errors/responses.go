package errors

import (
	"fmt"
	"net/http"
)

func (errs Errors) ServerErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	errs.logError(r, err)
	message := "the server encountered a problem and could not process your request"
	errs.errorResponse(w, r, http.StatusInternalServerError, message)
}

func (errs Errors) NotFoundResponse(w http.ResponseWriter, r *http.Request) {
	message := "the requested resource could not be found"
	errs.errorResponse(w, r, http.StatusNotFound, message)
}

func (errs Errors) MethodNotAllowedResponse(w http.ResponseWriter, r *http.Request) {
	message := fmt.Sprintf("the %s method is not supported for this resource", r.Method)
	errs.errorResponse(w, r, http.StatusMethodNotAllowed, message)
}

func (errs Errors) BadRequestResponse(w http.ResponseWriter, r *http.Request, err error) {
	errs.errorResponse(w, r, http.StatusBadRequest, err.Error())
}

func (errs Errors) FailedValidationResponse(w http.ResponseWriter, r *http.Request, errors map[string]string) {
	errs.errorResponse(w, r, http.StatusUnprocessableEntity, errors)
}

func (errs Errors) EditConflictResponse(w http.ResponseWriter, r *http.Request) {
	message := "unable to update the record due to an edit conflict, please try again"
	errs.errorResponse(w, r, http.StatusConflict, message)
}

func (errs Errors) RateLimitExceededResponse(w http.ResponseWriter, r *http.Request) {
	message := "rate limit exceeded"
	errs.errorResponse(w, r, http.StatusTooManyRequests, message)
}

func (errs Errors) InvalidCredentialsResponse(w http.ResponseWriter, r *http.Request) {
	message := "invalid authentication credentials"
	errs.errorResponse(w, r, http.StatusUnauthorized, message)
}

func (errs Errors) InvalidAuthenticationTokenResponse(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("WWW-Authenticate", "Bearer")
	message := "invalid or missing authentication token"
	errs.errorResponse(w, r, http.StatusUnauthorized, message)
}

func (errs Errors) AuthenticationRequiredResponse(w http.ResponseWriter, r *http.Request) {
	message := "you must be authenticated to access this resource"
	errs.errorResponse(w, r, http.StatusUnauthorized, message)
}
func (errs Errors) InactiveAccountResponse(w http.ResponseWriter, r *http.Request) {
	message := "your user account must be activated to access this resource"
	errs.errorResponse(w, r, http.StatusForbidden, message)
}

func (errs Errors) NotPermittedResponse(w http.ResponseWriter, r *http.Request) {
	message := "your user account doesn't have the necessary permissions to access this resource"
	errs.errorResponse(w, r, http.StatusForbidden, message)
}
