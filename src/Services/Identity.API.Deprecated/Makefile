

migrate:
	dotnet ef migrations add ${name} -o Data/Migrations --context IdentityContext

migrate-persisted:
	dotnet ef migrations add InitialIdentityServerPersistedGrantDbMigration -c PersistedGrantDbContext -o Data/Migrations/PersistedGrantDb
   
migrate-configuration:
	dotnet ef migrations add InitialIdentityServerConfigurationDbMigration -c ConfigurationDbContext -o Data/Migrations/ConfigurationDb

update:
	dotnet ef database update --context IdentityContext

update-persisted:
	dotnet ef database update --context PersistedGrantDbContext

update-configuration:
	dotnet ef database update --context ConfigurationDbContext

remove:
	dotnet ef migrations remove --context IdentityContext

publish:
	dotnet publish --os linux --arch x64 -c Release -p:PublishProfile=DefaultContainer

run:
	docker run -it --rm -p 5000:80 dotnetapi:1.0.0

tag:
	docker image tag dotnetapi:1.0.0 hazzajenko/dotnetapi:1.0.0

push:
	docker image push hazzajenko/dotnetapi:1.0.0
