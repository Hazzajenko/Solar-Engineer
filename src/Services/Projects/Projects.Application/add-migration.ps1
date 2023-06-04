$name = $args[0]
Write-Host "dotnet ef migrations add ${name} --startup-project ../Projects.API/ -o Data/Migrations --context ProjectsContext"
dotnet ef migrations add ${name} --startup-project ../Projects.API/ -o Data/Migrations --context ProjectsContext