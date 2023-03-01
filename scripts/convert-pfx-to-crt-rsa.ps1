$domain = $args[0]

openssl pkcs12 -in ./$domain.pfx -clcerts -nokeys -out $domain.crt
openssl pkcs12 -in ./$domain.pfx -nocerts -nodes -out $domain.rsa