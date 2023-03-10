
$location = [string](Get-Location)
$projectLocation = "${location}\src\Services\Projects.API\Projects.API.csproj"
Write-Host "dotnet run --project $projectLocation --launch-profile Projects-Https-V2"
# dotnet build --project $projectLocation
dotnet run --project $projectLocation --launch-profile Projects-Https-V2
