# Get outdated packages as JSON
$outdatedPackagesJson = pnpm outdated --format json

# Convert the JSON string to a PSObject
$outdatedPackagesObject = $outdatedPackagesJson | ConvertFrom-Json

# Get property names as the package names
$outdatedPackages = $outdatedPackagesObject.PSObject.Properties.Name

#Write-Host $outdatedPackages
Write-Host "Found $($outdatedPackages.Count) outdated packages"

$packagesThatContainAngular = $outdatedPackages | Where-Object { $_ -like "*angular*" }
$tailwindPackages = $outdatedPackages | Where-Object { $_ -like "*tailwind*" }
$storybookPackages = $outdatedPackages | Where-Object { $_ -like "*storybook*" }

Write-Host "Found $($packagesThatContainAngular.Count) outdated packages that contain 'angular'"
foreach ($packageName in $packagesThatContainAngular) {
  Write-Host "Updating package: $packageName"

  # Update the package
  pnpm update "$packageName"@latest

  Write-Host "Updated package: $packageName"
}