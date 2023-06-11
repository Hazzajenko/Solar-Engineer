Write-Host "docker-compose -f nginx/docker-compose.dev.yml up --detach --build"
docker-compose -f nginx/docker-compose.dev.yml up --detach --build
docker-compose -f docker-compose.traefik.dev.yml up --build --force-recreate --no-deps -d traefik
