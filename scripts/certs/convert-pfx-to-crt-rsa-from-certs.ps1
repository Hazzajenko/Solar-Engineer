# $domain = $args[0]
$domain = "solarengineer.app"
$certLocation = "~/.aspnet/https/${domain}"

$location = [string](Get-Location)
$sslDomainDirectory = $location.replace("\scripts", "\etc\ssl\${domain}")

# if (!(Test-Path $sslDomainDirectory)) {
#     New-Item -Path $sslDomainDirectory -ItemType Directory
# }

$crtDrop = "${sslDomainDirectory}\${domain}.crt"
$rsaDrop = "${sslDomainDirectory}\${domain}.rsa"
Write-Host $crtDrop
Write-Host $rsaDrop


Write-Host "Password is pa55w0rd!"
# Write-Host openssl pkcs12 -in ${certLocation}.pfx -clcerts -nokeys -out $crtDrop
openssl pkcs12 -in ${certLocation}.pfx -clcerts -nokeys -out $crtDrop
Write-Host "Password is pa55w0rd!"
openssl pkcs12 -in ${certLocation}.pfx -nocerts -nodes -out $rsaDrop

