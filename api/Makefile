include .envrc

create:
	@echo Creating migration ${name}...
	migrate create -ext sql -dir ./assets/migrations -seq ${name}
	@echo ${name} migration created!...


migrateup:
	@echo Executing migrate up...
	migrate -path ./assets/migrations -database ${DB_DSN} -verbose up
	@echo Migrated up!

migratedown:
	confirm
	@echo Executing migrate down...
	migrate -path ./migrations -database ${DB_DSN} -verbose down


migratedown1:
	confirm
	migrate -path ./migrations -database ${DB_DSN} -verbose down 1

.PHONY: build/api
build/api:
	@echo 'Building cmd/api...'
	go build -o=./bin/api.exe ./cmd/api


.PHONY: audit
audit:
	vendor
	@echo 'Tidying and verifying module dependencies...'
	go mod tidy
	go mod verify
	@echo 'Formatting code...'
	go fmt ./...
	@echo 'Vetting code...'
	go vet ./...
	staticcheck ./...
	@echo 'Running tests...'
	go test -race -vet=off ./...

.PHONY: vendor
vendor:
	@echo 'Tidying and verifying module dependencies...'
	go mod tidy
	go mod verify
	@echo 'Vendoring dependencies...'
	go mod vendor