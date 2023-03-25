

migrate:
	dotnet ef migrations add ${name} --startup-project ../Identity.API/ -o Data/Migrations --context IdentityContext

update:
	dotnet ef database update  --startup-project ../Identity.API/ --context IdentityContext

remove:
	dotnet ef migrations remove  --startup-project ../Identity.API/  --context IdentityContext
