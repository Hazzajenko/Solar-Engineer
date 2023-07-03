$version = Read-Host "Please enter a version/tag for the web-ui docker image"
Push-Location C:/Users/jenki/source/app/solar-engineer/src/WebUI
Write-Host "Running nx build web-app --configuration=production"
nx build web-app --configuration=production
Write-Host "Running docker build -f ./apps/web-app/Dockerfile . -t solarengineer-web-ui:${version}"
docker build -f ./apps/web-app/Dockerfile . -t solarengineer-web-ui:${version}
Pop-Location
