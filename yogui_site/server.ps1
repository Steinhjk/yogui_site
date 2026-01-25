$port = 8080
$path = $PWD.Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Listening on http://localhost:$port/"
Write-Host "Press Ctrl+C to stop."

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $localPath = Join-Path $path $request.Url.LocalPath
    if (Test-Path $localPath -PathType Container) {
        $localPath = Join-Path $localPath "index.html"
    }

    if (Test-Path $localPath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($localPath)
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        $response.StatusCode = 200
    } else {
        $response.StatusCode = 404
    }
    $response.Close()
}
