

migrate:
	dotnet ef migrations add ${name} --startup-project ../Identity.API/ -o Data/Migrations --context IdentityContext

update:
	dotnet ef database update  --startup-project ../Identity.API/ --context IdentityContext

remove:
	dotnet ef migrations remove  --startup-project ../Identity.API/  --context IdentityContext

publish:
	dotnet publish --os linux --arch x64 -c Release -p:PublishProfile=DefaultContainer

run:
	docker run -it --rm -p 5000:80 dotnetapi:1.0.0

tag:
	docker image tag dotnetapi:1.0.0 hazzajenko/dotnetapi:1.0.0

push:
	docker image push hazzajenko/dotnetapi:1.0.0
