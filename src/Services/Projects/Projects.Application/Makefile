

migrate:
	dotnet ef migrations add ${name} --startup-project ../Projects.API/ -o Data/Migrations --context ProjectsContext

update:
	dotnet ef database update  --startup-project ../Projects.API/ --context ProjectsContext

remove:
	dotnet ef migrations remove  --startup-project ../Projects.API/  --context ProjectsContext
