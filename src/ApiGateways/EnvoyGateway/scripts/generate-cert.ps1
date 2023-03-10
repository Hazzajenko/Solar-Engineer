openssl req -config https.config -new -out csr.pem

openssl x509 -req -days 365 -extfile https.config -extensions v3_req -in csr.pem -signkey key.pem -out https.crt

<# openssl req -x509 -newkey rsa:4096 -keyout example-com.key -out example-com.crt -days 365 #>