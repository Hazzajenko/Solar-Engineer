

migrate:
	dotnet ef migrations add ${name} -o Data/Migrations

update:
	dotnet ef database update

publish:
	dotnet publish --os linux --arch x64 -c Release -p:PublishProfile=DefaultContainer

run:
	docker run -it --rm -p 5010:80 dotnetapi:1.0.0
