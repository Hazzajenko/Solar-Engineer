$dir = Read-Host "Please enter library directory"
$name = Read-Host "Please enter library name"
if ($dir.Contains("libs/"))
{
  $dir = $dir.Replace("libs/", "")
}
if (!$dir.Contains("/$name"))
{
  $dir = "${dir}/${name}"
}
<#if ($dir.Contains("/$name"))
{
  $dir = $dir.Replace("/$name", "")
}#>
$dataAccessImportPath = "@${dir}/data-access"
$dataAccessTags = "${name}:data-access"

$featureImportPath = "@${dir}/feature"
$featureTags = "${name}:feature"

$path = $dir
if (!$path.Contains("libs/"))
{
  $path = "libs/${path}"
}
if (!$path.Contains("/$name"))
{
  $path = "${path}/${name}"
}

#$path = "./${path}/${name}"

If(!(test-path -PathType container $path))
{
  New-Item -ItemType Directory -Path $path
}

$dataAccessDir = "${dir}/data-access"
$featureDir = "${dir}/feature"
$commonDir = "${dir}/${name}"


nx generate @nx/angular:library --name=data-access --directory=$dir --importPath=$dataAccessImportPath --tags=$dataAccessTags --skipModule --skipSelector --no-interactive
nx generate @nx/angular:library --name=feature --directory=$dir --importPath=$featureImportPath --tags=$featureTags --changeDetection=OnPush --displayBlock --inlineStyle --inlineTemplate --skipModule --skipSelector --standalone --style=scss --no-interactive


#nx generate @nx/angular:library --name=data-access --directory=${dir}  --importPath=@${dir}/data-access --tags=${name}:data-access --skipModule --skipSelector --no-interactive
#nx generate @nx/angular:library --name=feature --directory=${dir}  --importPath=@${dir}/feature --tags=${name}:feature --changeDetection=OnPush --displayBlock --inlineStyle --inlineTemplate --skipModule --skipSelector --standalone --style=scss --no-interactive
