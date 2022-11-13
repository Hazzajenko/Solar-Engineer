package tokens

import (
	"errors"
	"fmt"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"github.com/golang-jwt/jwt/v4"
	"strconv"
	"time"
)

type Tokens struct {
	SigningKey string
}

type UserClaims struct {
	jwt.RegisteredClaims
	Issuer  string `json:"iss"`
	Name    string `json:"name"`
	Subject string `json:"sub"`
}

func InitTokens(key string) Tokens {
	return Tokens{
		SigningKey: key,
	}
}

func (t *Tokens) CreateToken(user *boiler.User) (string, error) {

	claims := UserClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "solarengineer.dev",
			Subject:   strconv.FormatInt(user.ID, 10),
			ID:        strconv.FormatInt(user.ID, 10),
			Audience:  []string{"solarengineer.dev"},
		},
		Name:    user.Name,
		Issuer:  "solarengineer.dev",
		Subject: strconv.FormatInt(user.ID, 10),
		//Subject: strconv.Itoa(int(user.ID)),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString([]byte(t.SigningKey))
	fmt.Printf("%v %v", ss, err)
	return ss, err
}

func (t *Tokens) VerifyToken(tokenString string) (*UserClaims, error) {

	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(t.SigningKey), nil
	})

	myClaims := token.Claims.(*UserClaims)
	fmt.Print(myClaims)
	fmt.Println("iss ", myClaims.Issuer)
	fmt.Println("name ", myClaims.Name)
	fmt.Println("sub ", myClaims.Subject)

	if err != nil {
		// handle err
		return nil, err
	}

	// validate the essential claims
	if !token.Valid {
		// handle invalid tokebn
		return nil, err
	}

	return myClaims, nil
}

func (t *Tokens) GetUserIdFromToken(tokenString string) (string, error) {
	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(t.SigningKey), nil
	})

	if err != nil {
		return "", err
	}

	myClaims := token.Claims.(*UserClaims)

	return myClaims.Subject, nil
}

func (t *Tokens) GetUserIdInt64FromToken(tokenString string) (int64, error) {
	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(t.SigningKey), nil
	})

	if err != nil {
		return 0, err
	}

	myClaims := token.Claims.(*UserClaims)

	result, err := strconv.ParseInt(myClaims.Subject, 10, 64)
	if err != nil {
		return 0, err
	}
	return result, nil

	//return myClaims.Subject, nil
}
