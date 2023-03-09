
$location = [string](Get-Location)
Write-Host "dotnet run --project ${location}\src\Services\Projects.API\Projects.API.csproj --launch-profile Projects-Https-V2"
dotnet run --project ${location}\src\Services\Projects.API\Projects.API.csproj --launch-profile Projects-Https-V2
