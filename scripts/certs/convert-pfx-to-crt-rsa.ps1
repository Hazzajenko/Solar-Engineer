$domain = $args[0]

Write-Host "Password is pa55w0rd!"
openssl pkcs12 -in ./$domain.pfx -clcerts -nokeys -out $domain.crt
Write-Host "Password is pa55w0rd!"
openssl pkcs12 -in ./$domain.pfx -nocerts -nodes -out $domain.rsa