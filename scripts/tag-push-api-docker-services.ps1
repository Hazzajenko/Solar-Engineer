$options = "web-ui", "identity-api", "projects-api"
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

foreach ($service in $options[$selection]) {
    $image = "solarengineer-$($service):$($version)"
    $taggedImage = "hazzajenko/$($image)"
    Write-Host "docker image tag ${image} ${taggedImage}"
    docker image tag ${image} ${taggedImage}
    Write-Host "docker image push ${taggedImage}"
    docker image push ${taggedImage}
}
