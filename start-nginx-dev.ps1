Write-Host "docker-compose -f nginx/docker-compose.dev.yml up ${args}"
docker-compose -f nginx/docker-compose.dev.yml up ${args}