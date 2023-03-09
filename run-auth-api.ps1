
$location = [string](Get-Location)
Write-Host "dotnet run --project ${location}\src\Services\Auth.API\Auth.API.csproj"
dotnet run --project ${location}\src\Services\Auth.API\Auth.API.csproj --launch-profile Auth-Https-V2
