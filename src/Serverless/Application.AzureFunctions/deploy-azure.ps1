. $PROFILE

$functionAppName = getAzureData FUNCTION_APP

$fn = ("func azure functionapp publish " + $functionAppName)
Write-Host $fn
func azure functionapp publish ${functionAppName}