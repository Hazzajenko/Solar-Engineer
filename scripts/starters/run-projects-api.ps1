
$location = [string](Get-Location)
$projectLocation = "${location}\src\Services\Projects\Projects.API\Projects.API.csproj"
Write-Host "dotnet run --project $projectLocation --launch-profile Projects-Https"
dotnet run --project $projectLocation --launch-profile Projects-Https
