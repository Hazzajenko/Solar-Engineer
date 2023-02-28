

migrate:
	dotnet ef migrations add ${name} -o Data/Migrations --context ProjectsContext

update:
	dotnet ef database update --context ProjectsContext

remove:
	dotnet ef migrations remove --context ProjectsContext

publish:
	dotnet publish --os linux --arch x64 -c Release -p:PublishProfile=DefaultContainer

run:
	docker run -it --rm -p 5000:80 projects-api:1.0.0

tag:
	docker image tag dotnetapi:1.0.0 hazzajenko/projects-api:1.0.0

push:
	docker image push hazzajenko/projects-api:1.0.0


