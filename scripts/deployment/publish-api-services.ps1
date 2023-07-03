# $location = [string](Get-Location)
# $project = "${location}\src\Services\Identity\Identity.API\Identity.API.csproj"
# $version = "1.0.2"
# Write-Host "dotnet publish ${project} --os linux --arch x64 -c Release -p:ContainerImageTags=${version}"
# dotnet publish ${project} --os linux --arch x64 -c Release -p:ContainerImageTag=${version}


$location = [string](Get-Location)
$project = "${location}\src\Services\Projects\Projects.API\Projects.API.csproj"
$version = "1.0.2"
Write-Host "dotnet publish ${project} --os linux --arch x64 -c Release -p:ContainerImageTags=${version}"
dotnet publish ${project} --os linux --arch x64 -c Release -p:ContainerImageTag=${version}