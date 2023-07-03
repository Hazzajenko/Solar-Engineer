$domain = $args[0]
$cert = New-SelfSignedCertificate -certstorelocation cert:\localmachine\my -dnsname $domain
$password = ConvertTo-SecureString -String "pa55w0rd!" -Force -AsPlainText
$certpath = "Cert:\localMachine\my\$($cert.Thumbprint)"
$location = [string](Get-Location)
$sslDomainDirectory = $location.replace("\scripts", "\etc\ssl\${domain}")

if (!(Test-Path $sslDomainDirectory)) {
    New-Item -Path $sslDomainDirectory -ItemType Directory
}

$pfxCertLocation = "${sslDomainDirectory}\${domain}.pfx"
Export-PfxCertificate -Cert $certpath -FilePath $pfxCertLocation -Password $password