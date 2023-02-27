

migrate:
	dotnet ef migrations add ${name} -o Data/Migrations --context UsersContext

update:
	dotnet ef database update --context UsersContext

remove:
	dotnet ef migrations remove --context UsersContext

publish:
	dotnet publish --os linux --arch x64 -c Release -p:PublishProfile=DefaultContainer

run:
	docker run -it --rm -p 5000:80 users-api:1.0.0

tag:
	docker image tag dotnetapi:1.0.0 hazzajenko/users-api:1.0.0

push:
	docker image push hazzajenko/users-api:1.0.0


