
$location = [string](Get-Location)
# // Write-Host "dotnet run --project ${location}\src\Services\Auth.API\Auth.API.csproj"
Write-Host "dotnet run --project ${location}\src\Services\Identity.API\Identity.API.csproj"

dotnet run --project ${location}\src\Services\Identity.API\Identity.API.csproj --launch-profile Identity-Https-V2
# // dotnet run --project ${location}\src\Services\Auth.API\Auth.API.csproj --launch-profile Auth-Https-V2
