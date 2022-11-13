package handlers

import (
	"errors"
	"fmt"
	"github.com/Hazzajenko/gosolarbackend/internal/data/models/users"
	"github.com/Hazzajenko/gosolarbackend/internal/json"
	"github.com/Hazzajenko/gosolarbackend/internal/validators"
	"net/http"
)

func (h *Handlers) RegisterUserHandler(w http.ResponseWriter, r *http.Request) {

	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.BadRequestResponse(w, r, err)
		//errs.badRequestResponse(w, r, err)
		return
	}

	user := &users.User{
		Name:      input.Name,
		Email:     input.Email,
		Activated: false,
	}

	err = user.Password.Set(input.Password)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}
	v := validators.New()
	// Validate the user struct and return the error messages to the client if any of
	// the checks fail.
	if users.ValidateUser(v, user); !v.Valid() {
		h.Errors.FailedValidationResponse(w, r, v.FieldErrors)
		return
	}
	err = h.Models.Users.Insert(user)
	if err != nil {
		switch {
		case errors.Is(err, users.ErrDuplicateEmail):
			v.AddError("a user with this email address already exists")
			h.Errors.FailedValidationResponse(w, r, v.FieldErrors)
		default:
			h.Errors.ServerErrorResponse(w, r, err)
		}
		return
	}

	/*	err = app.models.Permissions.AddForUser(user.ID, "projects:read")
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
	*/
	/*	token, err := app.models.Tokens.New(user.ID, 3*24*time.Hour, data.ScopeActivation)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}*/
	//token, err := h.Tokens.CreateToken(user)
	if err != nil {
		return
	}
	//token := user.CreateToken()
	//token := app.createToken(*user)

	//app.logger.PrintInfo(token, nil)
	//app.logger.PrintInfo(token.Plaintext, nil)

	err = h.Json.ResponseJSON(w, http.StatusAccepted, json.Envelope{"user": user}, nil)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}

}

func (h *Handlers) LoginUserHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email     string               `json:"Email"`
		Password  string               `json:"Password"`
		Validator validators.Validator `json:"-"`
	}

	err := h.Json.DecodeJSON(w, r, &input)
	if err != nil {
		h.Errors.BadRequestResponse(w, r, err)
		//errs.badRequestResponse(w, r, err)
		return
	}

	user, err := h.Models.Users.GetByEmail(input.Email)
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
		return
	}

	input.Validator.CheckField(input.Email != "", "Email", "Email is required")
	input.Validator.CheckField(user != nil, "Email", "Email address could not be found")

	//fix this
	/*	if user != nil {
		match, err := user.Password.Matches(input.Password)
		if err != nil {
			h.Errors.ServerErrorResponse(w, r, err)
			return
		}

		if !match {
			h.Errors.InvalidCredentialsResponse(w, r)
			return
		}
		input.Validator.CheckField(input.Password != "", "Password", "Password is required")
	}*/
	if input.Validator.HasErrors() {
		h.Errors.FailedValidationResponse(w, r, input.Validator.FieldErrors)
		return
	}
	token, err := h.Tokens.CreateToken(user)
	if err != nil {
		return
	}
	_, err = h.Tokens.VerifyToken(token)
	if err != nil {
		return
	}

	fmt.Println(token)

	err = h.Json.ResponseJSON(w, http.StatusOK, json.Envelope{"user": user, "token": token /*, "claims": claims*/}, map[string][]string{"db": {"error starting server"}})
	if err != nil {
		h.Errors.ServerErrorResponse(w, r, err)
	}
}

/*		passwordMatches, err := password.Matches(input.Password, user.Password.)
						if err != nil {
							app.serverErrorResponse(w, r, err)
							return
						}

				input.Validator.CheckField(input.Password != "", "Password", "Password is required")
				//input.Validator.CheckField(passwordMatches, "Password", "Password is incorrect")
			}

			if input.Validator.HasErrors() {
				u.Errs.FailedValidationResponse(w, r, input.Validator.FieldErrors)
				return
			}

			//token := app.createToken(*user)
			//token := user.CreateToken()
			token, err := u.Tokens.CreateToken(user)
			if err != nil {
				return
			}
			claims, err := u.Tokens.VerifyToken(token)
			if err != nil {
				return
			}

			fmt.Println(token)

			err = response.JSON(w, http.StatusOK, helpers.Envelope{"user": user, "token": token, "claims": claims})
			if err != nil {
				u.Errs.ServerErrorResponse(w, r, err)
			}
		}



		/*func (app *application) registerUser(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	username := c.FormValue("username")
	password := c.FormValue("password")
	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := u.Helpers.ReadJSON(w, r, &input)
	if err != nil {
		u.Errs.BadRequestResponse(w, r, err)
		return
	}

	user := &data.User{
		Name:      input.Name,
		Email:     input.Email,
		Activated: false,
	}

	err = user.Password.Set(input.Password)
	if err != nil {
		u.Errs.ServerErrorResponse(w, r, err)
		return
	}
	v := validator.New()

	if data.ValidateUser(v, user); !v.Valid() {
		u.Errs.FailedValidationResponse(w, r, v.FieldErrors)
		return
	}
	err = u.UserModel.Insert(user)
	if err != nil {
		switch {
		case stockErrors.Is(err, data.ErrDuplicateEmail):
			v.AddError("a user with this email address already exists")
			u.Errs.FailedValidationResponse(w, r, v.FieldErrors)
		default:
			u.Errs.ServerErrorResponse(w, r, err)
		}
		return
	}

	token, err := u.Tokens.CreateToken(user)
	if err != nil {
		return
	}

	err = u.Helpers.WriteJSON(w, http.StatusAccepted, helpers.Envelope{"user": user, "token": token}, nil)
	if err != nil {
		u.Errs.ServerErrorResponse(w, r, err)
	}
}*/
