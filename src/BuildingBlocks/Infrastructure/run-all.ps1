<#$location = [string](Get-Location)
#$location2 = (get-item $scriptPath).Directory.Parent.Parent.FullName
$RootPath = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$directory = Split-Path $PSScriptRoot
#$directory = Split-Path $PSScriptRoot -Leaf
#$scriptPath = (Get-ScriptDirectory);
#$path = ($scriptpath -split '\\')[-2]
#$split = ($path -split '\\')[0..(($path -split '\\').count -2)] -join '\'
#$location2 = (get-item $scriptPath ).parent.parent
#$location2 = (get-item $scriptPath ).parent.parent.FullName
Write-Host $location
Write-Host $RootPath
Write-Host $directory#>
<#function runAuth()
{
    dotnet run --project $RootPath\Services\Auth.API\Auth.API.csproj
}#>
$directory = Split-Path $PSScriptRoot
Write-Host $directory
. "${directory}\run-auth.ps1"
runAuth

#runAuth().
#$runAuth = dotnet run --project $RootPath\Services\Auth.API\Auth.API.csproj
#$runAuth.Invoke()

#\Services\Auth.API
#dotnet run --project $RootPath\Services\Auth.API\Auth.API.csproj
<#runAuth

function runAuth()
{
    dotnet run --project $RootPath\Services\Auth.API\Auth.API.csproj
}

function runUsers()
{
    dotnet run --project $RootPath\Services\Users.API\Users.API.csproj
}#>
#dotnet run --project ./projects/proj1/proj1.csproj
#Write-Host $exam
#Write-Host $split