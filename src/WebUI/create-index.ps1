$amount = 0
foreach ($f in Get-ChildItem *) {
  cti create "./$f"
  $amount++
  $childPaths =  Get-ChildItem -Path $f -Recurse -Directory -Force -ErrorAction SilentlyContinue | Select-Object FullName
  foreach ($p in $childPaths) {
    cti create $p.FullName
    $amount++
  }
}

Write-Host "Created $amount index files"