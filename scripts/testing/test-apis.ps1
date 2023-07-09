$location = [string](Get-Location)
$projectLocation = "${location}/tests/Services/Identity/Identity.API.Tests.Integration/Identity.API.Tests.Integration.csproj"
Write-Host "Testing identity api..."
dotnet test ${projectLocation} --no-build --verbosity normal

