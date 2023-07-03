docker images --format '{{.Repository}}:{{.Tag}}' | Where-Object { $_ -like "*:1.0.2" } | ForEach-Object { Write-Host "docker rmi $_" }
#docker images --format '{{.Repository}}:{{.Tag}}' | Where-Object { $_ -like "*:1.0.2" } | ForEach-Object { docker rmi $_ }
