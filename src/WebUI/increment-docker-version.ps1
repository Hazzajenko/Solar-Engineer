# Get the current version number from the Dockerfile
$version = (Get-Content Dockerfile | Select-String -Pattern 'LABEL version=').ToString().Split('=')[1].Trim()

# Increment the patch version
$versionParts = $version.Split('.')
$patchVersion = [int]$versionParts[2] + 1
$newVersion = "$($versionParts[0]).$($versionParts[1]).$patchVersion"

# Replace the version number in the Dockerfile
(Get-Content Dockerfile) | ForEach-Object { $_ -replace "LABEL version=$version", "LABEL version=$newVersion" } | Set-Content Dockerfile