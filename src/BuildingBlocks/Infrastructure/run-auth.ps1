$rootPath = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
dotnet run --project $rootPath\Services\Auth.API\Auth.API.csproj
#runAuth
#
#function runAuth()
#{
#    dotnet run --project $rootPath\Services\Auth.API\Auth.API.csproj
#}