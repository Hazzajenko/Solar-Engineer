# Define the actions you want to generate types for
$actions = @("add", "addMany", "update", "updateMany", "remove", "delete", "deleteMany")
$models = @("PANEL", "STRING", "PANEL_LINK", "PANEL_CONFIG")
#$actions = @("addPanel", "updatePanel")

# Define the model you want to use for all actions
#$model = "PROJECT_ENTITY_MODEL.PANEL"
$outputFile = "ProjectLocalStorageActions.ts"

# Clear the existing output file (if any)
if (Test-Path $outputFile)
{
  Remove-Item $outputFile
}
#export type ProjectLocalStorageActionDeletemanyPANEL_CONFIG = {
#  action: ReturnType<typeof PANEL_CONFIGActions.deleteMany>
#  model: typeof PANEL_CONFIG
#}

#export type ProjectLocalStorageActionUpdatemanyPanel = {
#  action: ReturnType<typeof PanelActions.Updatemany>
#  model: typeof PANEL
#}

function OldPascal($string)
{
  return ($string -split "[-_]" | ForEach-Object {
    $_.Substring(0, 1).ToUpper() + $_.Substring(1).ToLower()
  }) -join ""
}

#export type ProjectLocalStorageActionAddSTRING = {
#  action: ReturnType<typeof StringsActions.Add>
#  model: typeof PROJECT_ENTITY_MODEL.STRING
#}

function ToPascalCase($string)
{
  return ($string -split "[-_]" | ForEach-Object {
    $_.Substring(0, 1).ToUpper() + $_.Substring(1)
  }) -join ""
}

foreach ($model in $models)
{
  # Generate the types
  foreach ($action in $actions)
  {
    $pascalCaseAction = ToPascalCase($action)
    $pascalCaseModel = OldPascal($model)
    $typeName = "ProjectLocalStorageAction" + $pascalCaseAction + $pascalCaseModel
    $typeOfAction = $pascalCaseModel + "sActions.$pascalCaseAction"
    $fileContent = @"
export type $typeName = {
  action: ReturnType<typeof $typeOfAction>
    model: typeof PROJECT_ENTITY_MODEL.$model
   }
"@

    # Write the types to a file
    #    $fileContent | Out-File "$typeName.ts"
    Add-Content $outputFile $fileContent
  }
}

## Generate the types
#foreach ($action in $actions)
#{
#  $typeName = "ProjectLocalStorageAction" + (Get-Culture).textinfo.ToTitleCase($action)
#  $fileContent = @"
#export type $typeName = {
#    action: ReturnType<typeof PanelsActions.$action>
#    model: typeof $model
#}
#"@
#
#  # Write the types to a file
#  $fileContent | Out-File "$typeName.ts"
#}
