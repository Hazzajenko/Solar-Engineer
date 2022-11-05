package users

import "github.com/Hazzajenko/gosolarbackend/internal/validators"

func ValidateEmail(v *validators.Validator, email string) {
	v.Check(email != "", "must be provided")
	v.Check(validators.Matches(email, validators.RgxEmail), "must be a valid email address")
}
func ValidatePasswordPlaintext(v *validators.Validator, password string) {
	v.Check(password != "", "must be provided")
	v.Check(len(password) >= 8, "must be at least 8 bytes long")
	v.Check(len(password) <= 72, "must not be more than 72 bytes long")
}
func ValidateUser(v *validators.Validator, user *User) {
	v.Check(user.Name != "", "must be provided")
	v.Check(len(user.Name) <= 500, "must not be more than 500 bytes long")
	ValidateEmail(v, user.Email)

	if user.Password.plaintext != nil {
		ValidatePasswordPlaintext(v, *user.Password.plaintext)
	}

	if user.Password.hash == nil {
		panic("missing password hash for user")
	}
}
