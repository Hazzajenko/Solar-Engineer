$fileToCopy = $args[0]
$destinationRelativeToRoot = $args[1]

$envContent = Get-Content .env

$linuxSsh = ($envContent | Select-String -Pattern "^VM_SSH=(.*)$").Matches.Groups[1].Value
$privateKey = ($envContent | Select-String -Pattern "^PRIVATE_KEY=(.*)$").Matches.Groups[1].Value

$location = [string](Get-Location)
$windowsCopyDir = "${location}/${fileToCopy}"
$linuxPasteDir = "/root/${destinationRelativeToRoot}"

Write-Host "Copying ${windowsCopyDir} to ${linuxPasteDir}"
pscp -i ${privateKey} ${windowsCopyDir} ${linuxSsh}:${linuxPasteDir}