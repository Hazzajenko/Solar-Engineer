$options = "data-access", "feature", "ui", "utils", "shared"
Write-Host "OPTIONS:" -BackgroundColor Black -ForegroundColor White
For ($i=0; $i -lt $options.Count; $i++)
{
  Write-Host "$($i): $($options[$i])"
}
Write-Host "ENTER THE NUMBER of the options(s)" -NoNewLine
$selection = Read-Host " or Q to quit"
$selection = $selection -split ","

if ($selection -eq "Q")
{
  exit
}

$dir = Read-Host "Please enter library directory"
$name = Read-Host "Please enter a library name"
if ($dir.Contains("libs/"))
{
  $dir = $dir.Replace("libs/", "")
}

foreach($lib in $options[$selection]){
  $path = $dir
  if (!$path.Contains("libs/"))
  {
    $path = "libs/${path}"
  }
  $path = "${path}/${lib}"

  If(!(test-path -PathType container $path))
  {
    New-Item -ItemType Directory -Path $path
  }

  $libImportPath = "@${dir}/${lib}"
  $libTags = "${name}:${lib}"

  nx generate @nx/angular:library --name=$lib --directory=$dir --importPath=$libImportPath --tags=$libTags --skipModule --skipSelector --no-interactive
}
