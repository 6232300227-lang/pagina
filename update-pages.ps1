$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" -Exclude "index.html"

foreach ($file in $htmlFiles) {
    Write-Host "Procesando: $($file.Name)"
    $content = Get-Content $file.FullName -Raw
    
    # Agregar auth.css si no existe
    if ($content -notmatch 'assets/css/auth.css') {
        $content = $content -replace '(<link rel="stylesheet" href="assets/css/pages/[^"]*\.css">)', ('$1' + "`n    " + '<link rel="stylesheet" href="assets/css/auth.css">')
    }
    
    # Agregar auth.js si no existe
    if ($content -notmatch 'assets/js/auth\.js') {
        $content = $content -replace '(</body>)', ('    <script src="assets/js/auth.js"></script>' + "`n    " + '$1')
    }
    
    # Guardar el archivo
    Set-Content $file.FullName $content -Force
    Write-Host ("OK: " + $file.Name)
}

Write-Host "Actualizacion completada"

