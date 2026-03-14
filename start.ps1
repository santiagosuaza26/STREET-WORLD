param(
    [switch]$SkipDocker,
    [switch]$SkipInstall,
    [switch]$NoStart,
    [switch]$NoClean,
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$workspace = Split-Path -Parent $MyInvocation.MyCommand.Path
$runtimeDir = Join-Path $workspace ".runtime"
$webPidFile = Join-Path $runtimeDir "web.pid"
$apiPidFile = Join-Path $runtimeDir "api.pid"
$webNextDir = Join-Path $workspace "apps\web\.next"

function Write-Step([string]$message) {
    Write-Host "`n==> $message" -ForegroundColor Cyan
}

function Invoke-OrDryRun([string]$label, [scriptblock]$action) {
    if ($DryRun) {
        Write-Host "[DRY RUN] $label" -ForegroundColor Yellow
        return
    }

    & $action
}

function Stop-ProcessByPort([int]$port) {
    $connections = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
    if (-not $connections) {
        Write-Host "Puerto $port libre" -ForegroundColor DarkGray
        return
    }

    $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($procId in $pids) {
        try {
            $proc = Get-Process -Id $procId -ErrorAction Stop
            Stop-Process -Id $procId -Force
            Write-Host "Detenido PID $procId en puerto $port ($($proc.ProcessName))" -ForegroundColor Yellow
        }
        catch {
            Write-Host "No se pudo detener PID $procId en puerto ${port}: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

function Stop-ProcessFromPidFile([string]$pidFile, [string]$name) {
    if (-not (Test-Path $pidFile)) {
        return
    }

    $pidValue = (Get-Content $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
    if (-not $pidValue) {
        Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
        return
    }

    if ($pidValue -match "^\d+$") {
        try {
            $proc = Get-Process -Id ([int]$pidValue) -ErrorAction Stop
            Stop-Process -Id $proc.Id -Force
            Write-Host "Detenido proceso previo de $name (PID $($proc.Id))" -ForegroundColor Yellow
        }
        catch {
            Write-Host "PID previo de $name no estaba activo" -ForegroundColor DarkGray
        }
    }

    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}

function Start-Server([string]$name, [string]$command, [string]$pidFile) {
    $pwsh = "pwsh"
    $arguments = @(
        "-NoExit",
        "-Command",
        "Set-Location '$workspace'; $command"
    )

    $process = Start-Process -FilePath $pwsh -ArgumentList $arguments -PassThru
    Set-Content -Path $pidFile -Value $process.Id
    Write-Host "$name iniciado (PID $($process.Id))" -ForegroundColor Green
}

Write-Host "Iniciando Street World..." -ForegroundColor Cyan

if (-not (Test-Path $runtimeDir)) {
    New-Item -ItemType Directory -Path $runtimeDir | Out-Null
}

Write-Step "Limpiando procesos anteriores"
Invoke-OrDryRun "Detener procesos previos por PID" {
    Stop-ProcessFromPidFile -pidFile $webPidFile -name "web"
    Stop-ProcessFromPidFile -pidFile $apiPidFile -name "api"
}

Invoke-OrDryRun "Liberar puertos 3000 y 3001" {
    Stop-ProcessByPort -port 3000
    Stop-ProcessByPort -port 3001
}

if (-not $NoClean) {
    Write-Step "Limpiando cache de Next (.next)"
    Invoke-OrDryRun "Eliminar carpeta apps/web/.next" {
        if (Test-Path $webNextDir) {
            Remove-Item -Recurse -Force $webNextDir
            Write-Host "Cache .next eliminada" -ForegroundColor Green
        }
        else {
            Write-Host "No habia cache .next" -ForegroundColor DarkGray
        }
    }
}

if (-not $SkipDocker) {
    Write-Step "Verificando Docker"
    Invoke-OrDryRun "Comprobar docker y levantar servicios" {
        $null = docker ps 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Docker no esta corriendo. Se continua sin docker-compose." -ForegroundColor Yellow
        }
        else {
            docker-compose up -d | Out-Null
            Write-Host "PostgreSQL y Redis activos (docker-compose up -d)" -ForegroundColor Green
        }
    }
}

if (-not $SkipInstall -and -not (Test-Path (Join-Path $workspace "node_modules"))) {
    Write-Step "Instalando dependencias"
    Invoke-OrDryRun "pnpm install" {
        Set-Location $workspace
        pnpm install
    }
}

if (-not $NoStart) {
    Write-Step "Iniciando API y Web"
    Invoke-OrDryRun "Start API/Web" {
        Start-Server -name "API" -command "pnpm --filter @street-world/api start:dev" -pidFile $apiPidFile
        Start-Server -name "Web" -command "pnpm --filter @street-world/web dev" -pidFile $webPidFile
    }
}

Write-Step "Listo"
Write-Host "Web: http://localhost:3000" -ForegroundColor White
Write-Host "API: http://localhost:3001/health" -ForegroundColor White
Write-Host ""
Write-Host "Opciones utiles:" -ForegroundColor Cyan
Write-Host "  ./start.ps1 -DryRun        # Muestra acciones sin ejecutar" -ForegroundColor White
Write-Host "  ./start.ps1 -NoClean       # No elimina apps/web/.next" -ForegroundColor White
Write-Host "  ./start.ps1 -NoStart       # Solo prepara entorno" -ForegroundColor White
Write-Host "  ./start.ps1 -SkipDocker    # No ejecuta docker-compose" -ForegroundColor White
