
$location = [string](Get-Location)

$usersLocation = "${location}\src\Services\Users.API\Users.API.csproj"
Write-Host "dotnet run --project $usersLocation --launch-profile Users-Https-V2"
# dotnet build --project $projectLocation
dotnet run --project $usersLocation --launch-profile Users-Https-V2
