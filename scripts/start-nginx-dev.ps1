Write-Host "docker-compose -f nginx/docker-compose.dev.yml up ${args}"
# docker-compose -f nginx/v2/docker-compose.yml up ${args}
docker-compose -f nginx/docker-compose.dev.yml up ${args}