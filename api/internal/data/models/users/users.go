package users

import (
	"context"
	"database/sql"
	"errors"
	boiler "github.com/Hazzajenko/gosolarbackend/my_models"
	"time"
)

type UserModel struct {
	DB *sql.DB
}

type User struct {
	ID        int64     `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  password  `json:"-"`
	Activated bool      `json:"activated"`
	Version   int       `json:"-"`
}

type password struct {
	plaintext *string
	hash      []byte
}

var (
	ErrDuplicateEmail = errors.New("duplicate email")
)

func (m *UserModel) Insert(user *User) error {
	query := `
		INSERT INTO users (name, email, password_hash, activated)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at, version`
	args := []any{user.Name, user.Email, user.Password.hash, user.Activated}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&user.ID, &user.CreatedAt, &user.Version)
	if err != nil {
		switch {
		case err.Error() == `pq: duplicate key value violates unique constraint "users_email_key"`:
			return errors.New("duplicate email")
		default:
			return err
		}
	}
	return nil
}

func (m *UserModel) GetByEmail(email string) (*boiler.User, error) {
	if email == "" {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	//getUser, err := boiler.FindUser(ctx, m.DB, )
	getUser, err := boiler.Users(boiler.UserWhere.Email.EQ(email)).One(ctx, m.DB)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	return getUser, nil
	/*	query := `
			SELECT id, created_at, name, email, password_hash, activated, version
			FROM users
			WHERE email = $1`
		var user User
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()
		err := m.DB.QueryRowContext(ctx, query, email).Scan(
			&user.ID,
			&user.CreatedAt,
			&user.Name,
			&user.Email,
			&user.Password.hash,
			&user.Activated,
			&user.Version,
		)
		if err != nil {
			switch {
			case errors.Is(err, sql.ErrNoRows):
				return nil, errors.New("record not found")
			default:
				return nil, err
			}
		}
		return &user, nil*/
}

func (m *UserModel) Update(user *User) error {
	query := `
		UPDATE users
		SET name = $1, email = $2, password_hash = $3, activated = $4, version = version + 1
		WHERE id = $5 AND version = $6
		RETURNING version`
	args := []any{
		user.Name,
		user.Email,
		user.Password.hash,
		user.Activated,
		user.ID,
		user.Version,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&user.Version)
	if err != nil {
		switch {
		case err.Error() == `pq: duplicate key value violates unique constraint "users_email_key"`:
			return errors.New("duplicate email")
		case errors.Is(err, sql.ErrNoRows):
			return errors.New("edit conflict")
		default:
			return err
		}
	}
	return nil
}

func (m *UserModel) Get(userId int64) (*boiler.User, error) {
	if userId < 1 {
		return nil, errors.New("record not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	getUser, err := boiler.FindUser(ctx, m.DB, userId)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errors.New("edit conflict")
		default:
			return nil, err
		}
	}

	return getUser, nil

	/*	query := `
			SELECT id, created_at, name, email, password_hash, activated, version
			FROM users
			WHERE id = $1`
		var user User
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()
		err := m.DB.QueryRowContext(ctx, query, id).Scan(
			&user.ID,
			&user.CreatedAt,
			&user.Name,
			&user.Email,
			&user.Password.hash,
			&user.Activated,
			&user.Version,
		)
		if err != nil {
			switch {
			case errors.Is(err, sql.ErrNoRows):
				return nil, errors.New("record not found")
			default:
				return nil, err
			}
		}
		return &user, nil*/

}
