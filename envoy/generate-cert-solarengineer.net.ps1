openssl req -config solarengineer.net.config -new -out solarengineer.net/csr.pem

openssl x509 -req -days 365 -extfile solarengineer.net.config -extensions v3_req -in solarengineer.net/csr.pem -signkey solarengineer.net/key.pem -out solarengineer.net/https.crt

<# openssl req -x509 -newkey rsa:4096 -keyout example-com.key -out example-com.crt -days 365 #>