. $PROFILE

$resourceGroupName = getAzureData RESOURCE_GROUP_NAME
$storageName = getAzureData STORAGE_NAME
$locationName = getAzureData LOCATION
$functionAppName = getAzureData FUNCTION_APP

$fn = ("az functionapp create " +
        "--consumption-plan-location " + $locationName + " " +
        "--name " + $functionAppName + " " +
        "--resource-group " + $resourceGroupName + " " +
        "--runtime dotnet-isolated " +
        "--functions-version 4 " +
        "--storage-account " + $storageName + " ")

Write-Host $fn
az functionapp create `
    --consumption-plan-location ${locationName} `
    --name ${functionAppName} `
    --resource-group ${resourceGroupName} `
    --runtime dotnet-isolated `
    --functions-version 4 `
    --storage-account ${storageName}
