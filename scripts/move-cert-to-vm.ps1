$location = [string](Get-Location)
$certFile = "solarengineer.vault.pfx"
$certWindowsDir = "${location}/https/${certFile}"
$certLinuxDir = "/home/docker/https/${certFile}"

<# $linuxSsh
$privateKey
Get-Content .env | ForEach-Object {
    $name, $value = $_.split('=')
    if ([string]::IsNullOrWhiteSpace($name) || $name.Contains('#')) {
        # continue
    }
    else {
        if ($name -eq "VM_SSH") {
            $linuxSsh = $value
        }
        if ($name -eq "PRIVATE_KEY") {
            $privateKey = $value
        }
    }

} #>

$envContent = Get-Content .env

$linuxSsh = ($envContent | Select-String -Pattern "^VM_SSH=(.*)$").Matches.Groups[1].Value
$privateKey = ($envContent | Select-String -Pattern "^PRIVATE_KEY=(.*)$").Matches.Groups[1].Value

Write-Host "Copying ${certWindowsDir} to ${certLinuxDir}"
pscp -i ${privateKey} ${certWindowsDir} ${linuxSsh}:${certLinuxDir}
