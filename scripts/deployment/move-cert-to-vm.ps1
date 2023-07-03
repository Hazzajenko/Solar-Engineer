$location = [string](Get-Location)
$certFile = "solarengineer.vault.pfx"
$certWindowsDir = "${location}/https/${certFile}"
$certLinuxDir = "/home/docker/https/${certFile}"

$envContent = Get-Content .env

$linuxSsh = ($envContent | Select-String -Pattern "^VM_SSH=(.*)$").Matches.Groups[1].Value
$privateKey = ($envContent | Select-String -Pattern "^PRIVATE_KEY=(.*)$").Matches.Groups[1].Value

Write-Host "Copying ${certWindowsDir} to ${certLinuxDir}"
pscp -i ${privateKey} ${certWindowsDir} ${linuxSsh}:${certLinuxDir}
