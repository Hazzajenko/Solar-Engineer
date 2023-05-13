$dir = Read-Host "Please enter library directory"
$name = Read-Host "Please enter a data-access library name"
if ($dir.Contains("libs/"))
{
  $dir = $dir.Replace("libs/", "")
}
if (!$dir.Contains("/$name"))
{
  $dir = "${dir}/${name}"
}

$dataAccessImportPath = "@${dir}/data-access"
$dataAccessTags = "${name}:data-access"

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

nx generate @nx/angular:library --name=data-access --directory=$dir --importPath=$dataAccessImportPath --tags=$dataAccessTags --skipModule --skipSelector --no-interactive
