$processNames = @("Identity.API", "Projects.API")

$availableProcesses = Get-Process | Where-Object { $processNames -contains $_.ProcessName }

Write-Host "OPTIONS:" -BackgroundColor Black -ForegroundColor White
For ($i = 0; $i -lt $availableProcesses.Count; $i++) {
    Write-Host "$($i): $($availableProcesses[$i].ProcessName)"
}

Write-Host "ENTER THE NUMBER of  the process you wish to attach to" -NoNewLine

$selection = Read-Host " or Q to quit"

if ($selection -eq "Q") {
    exit
}

$processName = $availableProcesses[$selection].ProcessName

Write-Host "Process Name: $processName"

$processId = $availableProcesses[$selection].Id

dotnet-counters monitor --process-id $processId Microsoft.AspNetCore.Http.Connections

