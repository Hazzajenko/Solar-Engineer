# Set the file path
#$currentDirectory = [string](Get-Location)
$filePath = "version.txt"

# Read the version from a file
$version = Get-Content $filePath

# Alternatively, read the version from an environment variable
# $version = Get-Content env:version

# Split the version into parts
$versionParts = $version.Split(".")

# Increment the last part
$versionParts[2] = [int]$versionParts[2] + 1

# Join the parts back together
$newVersion = $versionParts -join "."

# Output the new version
Write-Output "New Version: $newVersion"

# Update the file with the new version
Set-Content $filePath $newVersion

# Alternatively, update the environment variable with the new version
# Set-Content env:version $newVersion
