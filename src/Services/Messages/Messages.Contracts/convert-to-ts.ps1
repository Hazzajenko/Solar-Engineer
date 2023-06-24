. $PROFILE
$projectDir = Get-ProjectDirectory
$outputPath = "${projectDir}\src\WebUI\libs\auth\shared\src\lib\messages\data"
#$outputPath = "${projectDir}\src\WebUI\libs\auth\shared\src\lib\messages\responses"
#$outputPath = "${projectDir}\src\WebUI\libs\auth\shared\src\lib\messages\requests"

dotnet-cs2ts ./Data -k -m -a -o $outputPath
#dotnet-cs2ts ./Requests -k -m -a -o $outputPath
#dotnet-cs2ts ./Responses -k -m -a -o $outputPath