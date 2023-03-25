

migrate:
	dotnet ef migrations add ${name} -o Data/Migrations --context AuthContext

migrate2:
	dotnet ef migrations add ${name} -o ../Identity.Application/Data/Migrations --context IdentityContext

migrate3:
	dotnet ef migrations add Migration2 --startup-project ../Identity.Application/ --context IdentityContext
	#dotnet ef migrations add Migration2 --startup-project ../MyApp.Web/MyApp.Web.csproj --context MyAppDbContext

update:
	dotnet ef database update --context AuthContext

remove:
	dotnet ef migrations remove --context AuthContext

publish:
	dotnet publish --os linux --arch x64 -c Release -p:PublishProfile=DefaultContainer

run:
	docker run -it --rm -p 5000:80 dotnetapi:1.0.0

tag:
	docker image tag dotnetapi:1.0.0 hazzajenko/dotnetapi:1.0.0

push:
	docker image push hazzajenko/dotnetapi:1.0.0
