function PublishWebUi {
    Push-Location C:/Users/jenki/source/app/solar-engineer/src/WebUI
    Write-Host "Running nx build web-app --configuration=production"
    nx build web-app --configuration=production
    Write-Host "Running docker build -f ./apps/web-app/Dockerfile . -t solarengineer-web-ui:${version}"
    docker build -f ./apps/web-app/Dockerfile . -t solarengineer-web-ui:${version}
    Pop-Location
}

$options = "WebUi", "Identity", "Projects"
Write-Host "OPTIONS:" -BackgroundColor Black -ForegroundColor White
For ($i = 0; $i -lt $options.Count; $i++) {
    Write-Host "$($i): $($options[$i])"
}
Write-Host "ENTER THE NUMBER of the options(s)" -NoNewLine
$selection = Read-Host " or Q to quit"
$selection = $selection -split ","

if ($selection -eq "Q") {
    exit
}

$version = Read-Host "Please enter a version/tag for the docker image(s)"

$location = [string](Get-Location)
foreach ($service in $options[$selection]) {
    if ($service -eq "WebUi") {
        PublishWebUi
        continue
    }
    $project = "${location}\src\Services\$($service)\$($service).API\$($service).API.csproj"
    Write-Host "dotnet publish ${project} --os linux --arch x64 -c Release -p:ContainerImageTags=${version}"
    dotnet publish ${project} --os linux --arch x64 -c Release -p:ContainerImageTag=${version}
}

foreach ($service in $options[$selection]) {
    $image = "solarengineer-$($service):$($version)"
    $taggedImage = "hazzajenko/$($image)"
    Write-Host "docker image tag ${image} ${taggedImage}"
    docker image tag ${image} ${taggedImage}
    Write-Host "docker image push ${taggedImage}"
    docker image push ${taggedImage}
}
