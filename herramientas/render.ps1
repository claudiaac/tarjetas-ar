# Convierte cada disenos/*.svg en un PNG de 1000x1000 (la imagen que reconoce la cámara).
# Uso: powershell -File herramientas\render.ps1 [nombre]
param([string]$solo = "")
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$dir = Join-Path $PSScriptRoot "..\disenos" | Resolve-Path
Get-ChildItem "$dir\*.svg" | Where-Object { -not $solo -or $_.BaseName -eq $solo } | ForEach-Object {
  $png = Join-Path $dir ($_.BaseName + ".png")
  $url = "file:///" + ($_.FullName -replace '\\', '/')
  $args = @("--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=5000",
            "--window-size=1000,1000", "--screenshot=`"$png`"", $url)
  $p = Start-Process -FilePath $edge -ArgumentList $args -PassThru -WindowStyle Hidden
  if (-not $p.WaitForExit(30000)) { $p.Kill() }
  Write-Output "$($_.BaseName).png"
}
