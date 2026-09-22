$ErrorActionPreference = 'Stop'
$projectDir = $PSScriptRoot
$localUrl = 'http://127.0.0.1:5173'
try {
    $response = Invoke-WebRequest -Uri $localUrl -TimeoutSec 2 -UseBasicParsing
    if ($response.Content -match 'sczs-planner') {
        Start-Process $localUrl
        exit
    }
    throw 'Port 5173 is occupied by another application.'
} catch {
    if ($_.Exception.Message -match 'occupied') { throw }
}
if (-not (Test-Path -LiteralPath (Join-Path $projectDir 'node_modules/vite/bin/vite.js'))) {
    throw 'Dependencies are missing. Run npm install in the boh-web folder first.'
}
$runtimeDir = Join-Path $projectDir '.runtime'
New-Item -ItemType Directory -Path $runtimeDir -Force | Out-Null
$nodePath = (Get-Command node.exe).Source
Start-Process -FilePath $nodePath -ArgumentList @('node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5173','--strictPort') -WorkingDirectory $projectDir -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimeDir 'server.log') -RedirectStandardError (Join-Path $runtimeDir 'server-error.log')
for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Milliseconds 500
    try {
        $response = Invoke-WebRequest -Uri $localUrl -TimeoutSec 2 -UseBasicParsing
        if ($response.Content -match 'sczs-planner') { Start-Process $localUrl; exit }
    } catch {}
}
throw 'The local page did not start. See boh-web/.runtime/server-error.log.'
