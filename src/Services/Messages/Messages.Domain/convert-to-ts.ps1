. $PROFILE
$projectDir = Get-ProjectDirectory
$outputPath = "${projectDir}\src\WebUI\libs\auth\shared\src\lib\messages"

dotnet-cs2ts ./entities -k -m -a -o $outputPath