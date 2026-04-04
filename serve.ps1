param(
    [int]$Port = 8000
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$prefix = "http://localhost:$Port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try {
    $listener.Start()
} catch {
    Write-Error "Failed to start HTTP listener on $prefix. Ensure the port is free and you have permissions."
    exit 1
}

Write-Output "Serving $scriptDir on $prefix (Press Ctrl+C to stop)"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $resp = $context.Response

        $urlPath = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
        if ([string]::IsNullOrEmpty($urlPath)) { $urlPath = 'index.html' }

        $localPath = Join-Path $scriptDir $urlPath

        if (Test-Path $localPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            switch -regex ($localPath) {
                '\.html$' { $ct='text/html; charset=utf-8'; break }
                '\.css$'  { $ct='text/css'; break }
                '\.js$'   { $ct='application/javascript'; break }
                '\.json$' { $ct='application/json'; break }
                '\.png$'  { $ct='image/png'; break }
                '\.jpe?g$' { $ct='image/jpeg'; break }
                '\.webp$' { $ct='image/webp'; break }
                '\.svg$'  { $ct='image/svg+xml'; break }
                default { $ct='application/octet-stream' }
            }
            $resp.ContentType = $ct
            $resp.ContentLength64 = $bytes.Length
            $resp.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $resp.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $resp.ContentType = 'text/plain; charset=utf-8'
            $resp.ContentLength64 = $msg.Length
            $resp.OutputStream.Write($msg, 0, $msg.Length)
        }
        $resp.OutputStream.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
