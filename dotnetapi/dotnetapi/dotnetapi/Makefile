

migrate:
	dotnet ef migrations add ${name} -o Data/Migrations

update:
	dotnet ef database update

publish:
	dotnet publish --os linux --arch x64 -c Release -p:PublishProfile=DefaultContainer

run:
	docker run -it --rm -p 5000:80 dotnetapi:1.0.0

genCert:
	dotnet dev-certs https -ep %USERPROFILE%\.aspnet\https\aspnetapp.pfx -p mypass123

bam:
	docker run --rm -it -p 5000:80 -p 5001:443 -e ASPNETCORE_URLS="https://+;http://+" -e ASPNETCORE_HTTPS_PORT=5001 -e ASPNETCORE_ENVIRONMENT=Development -v $Env:APPDATA\microsoft\UserSecrets\:/root/.microsoft/usersecrets -v $Env:USERPROFILE\.aspnet\https:/root/.aspnet/https/ backend:latest
	
bam2:
	docker run -p 5000:80 -p 5001:443 -e ASPNETCORE_URLS="https://+;http://+" -e ASPNETCORE_HTTPS_PORT=5001 -e ASPNETCORE_Kestrel__Certificates__Default__Password="mypass123" -e ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx -v $env:USERPROFILE\.aspnet\https:/https/ dotnetapi:1.0.0
	
bam3:
	docker run --rm -it -p 8000:80 -p 8001:443 -e ASPNETCORE_URLS="https://+;http://+" -e ASPNETCORE_HTTPS_PORT=8001 -e ASPNETCORE_Kestrel__Certificates__Default__Password="mypass123" -e ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx -v $env:USERPROFILE\.aspnet\https:/https/ dotnetapi:1.0.0
	
build:
	docker build . --no-cache --pull --tag dotnetapi:1.0.1 

buildCustom:
	docker build . -f Dockerfile-v2 --no-cache --pull --tag dotnetapi:1.0.1  
	
fullbuild:
	docker compose -f .\docker-compose-full.yml build --no-cache
	
up:
	docker-compose -f docker-compose-full.yml up

ba:
	docker run -it --rm -d -env ASPNETCORE_ENVIRONMENT = 'Production' \
    -env DATABASE_HOST = 'postgres-solarengineer-do-user-11630140-0.b.db.ondigitalocean.com' \
    -env DATABASE_PORT = '25060' \
    -env DATABASE_USERNAME = 'doadmin' \
    -env DATABASE_PASSWORD = 'AVNS_eIDAV_jplzcmCdgCWV6' \
    -env DATABASE_DATABASE = 'defaultdb' \
    -p 5000:80 \
    --name dotnetapips dotnetapi:1.0.0
    
    
bammm:
	docker run -it --rm -d -p 5000:80 --env-file=.env --name dotnetapienv dotnetapi:1.0.0

envrun:
	docker run -it --rm -d -p 5000:80 --env-file=.env --name dotnetapienv dotnetapi:1.0.1

tag:
	docker image tag dotnetapi:1.0.0 hazzajenko/dotnetapi:1.0.0

tag1:
	docker image tag dotnetapi:1.0.1 hazzajenko/dotnetapi:1.0.1

push:
	docker image push hazzajenko/dotnetapi:1.0.0

push1:
	docker image push hazzajenko/dotnetapi:1.0.1
#    docker run -it --rm -d -p 700:80 --name dotty dotnetapi:1.0.0 