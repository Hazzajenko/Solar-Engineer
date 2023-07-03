$runningContainers = docker ps --filter "status=running" --format '{{.Names}}'
$containerArray = $runningContainers.Split([Environment]::NewLine)

foreach ($container in $containerArray) {
    Write-Host "Running container: $container"
}

$options = $containerArray
Write-Host "OPTIONS:" -BackgroundColor Black -ForegroundColor White
For ($i = 0; $i -lt $options.Count; $i++) {
    Write-Host "$($i): $($options[$i])"
}
Write-Host "ENTER THE NUMBER of  the container you wish to exec into" -NoNewLine
$selection = Read-Host " or Q to quit"

if ($selection -eq "Q") {
    exit
}

$containerName = $options[$selection]
$containerId = docker ps --filter "name=${containerName}" --format '{{.ID}}'

Write-Host "Container ID: $containerId"

docker exec -it $containerId /bin/bash
