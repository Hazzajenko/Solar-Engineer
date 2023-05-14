$dir = Read-Host "Please enter library directory"
$name = Read-Host "Please enter a utils library name"
if ($dir.Contains("libs/"))
{
  $dir = $dir.Replace("libs/", "")
}
if (!$dir.Contains("/$name"))
{
  $dir = "${dir}/${name}"
}

$utilsImportPath = "@${dir}/utils"
$utilsTags = "${name}:utils"

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

nx generate @nx/angular:library --name=utils --directory=$dir --importPath=$utilsImportPath --tags=$utilsTags --skipModule --skipSelector --no-interactive
