

migrate:
	dotnet ef migrations add ${name} --startup-project ../Messages.API/ -o Data/Migrations --context MessagesContext

update:
	dotnet ef database update  --startup-project ../Messages.API/ --context MessagesContext

remove:
	dotnet ef migrations remove  --startup-project ../Messages.API/  --context MessagesContext
