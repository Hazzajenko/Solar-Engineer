$dir = Read-Host "Please enter a library directory"
$name = Read-Host "Please enter a feature library name"
if ($dir.Contains("libs/"))
{
  $dir = $dir.Replace("libs/", "")
}
if (!$dir.Contains("/$name"))
{
  $dir = "${dir}/${name}"
}

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

If(!(test-path -PathType container $path))
{
  New-Item -ItemType Directory -Path $path
}



nx generate @nx/angular:library --name=feature --directory=$dir --importPath=$featureImportPath --tags=$featureTags --changeDetection=OnPush --displayBlock --inlineStyle --inlineTemplate --skipModule --skipSelector --standalone --style=scss --no-interactive


#nx generate @nx/angular:library --name=data-access --directory=${dir}  --importPath=@${dir}/data-access --tags=${name}:data-access --skipModule --skipSelector --no-interactive
#nx generate @nx/angular:library --name=feature --directory=${dir}  --importPath=@${dir}/feature --tags=${name}:feature --changeDetection=OnPush --displayBlock --inlineStyle --inlineTemplate --skipModule --skipSelector --standalone --style=scss --no-interactive
