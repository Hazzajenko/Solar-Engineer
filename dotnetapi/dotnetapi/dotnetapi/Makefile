

migrate:
	dotnet ef migrations add ${name} -o Data/Migrations

update:
	dotnet ef database update

publish:
	dotnet publish --os linux --arch x64 -c Release -p:PublishProfile=DefaultContainer

run:
	docker run -it --rm -p 5010:80 dotnetapi:1.0.0

bam:
	docker run --rm -it -p 5000:80 -p 5001:443 -e ASPNETCORE_URLS="https://+;http://+" -e ASPNETCORE_HTTPS_PORT=5001 -e ASPNETCORE_ENVIRONMENT=Development -v $Env:APPDATA\microsoft\UserSecrets\:/root/.microsoft/usersecrets -v $Env:USERPROFILE\.aspnet\https:/root/.aspnet/https/ backend:latest