$dir = Read-Host "Please enter library directory"
$name = Read-Host "Please enter a shared library name"
if ($dir.Contains("libs/"))
{
  $dir = $dir.Replace("libs/", "")
}
if (!$dir.Contains("/$name"))
{
  $dir = "${dir}/${name}"
}

$sharedImportPath = "@${dir}/shared"
$sharedTags = "${name}:shared"

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

nx generate @nx/angular:library --name=shared --directory=$dir --importPath=$sharedImportPath --tags=$sharedTags --skipModule --skipSelector --no-interactive
