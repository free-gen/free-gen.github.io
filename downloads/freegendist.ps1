$ProgressPreference = 'SilentlyContinue'
$TestMode = $false

function Set-Status {
    param([string]$Text)
    
    $p = $host.UI.RawUI.CursorPosition
    $p.Y = $StatusLine
    $host.UI.RawUI.CursorPosition = $p
    
    Write-Host (" " * ($host.UI.RawUI.WindowSize.Width)) -NoNewline
    $host.UI.RawUI.CursorPosition = $p

    Write-Host ("   " + $Text) -ForegroundColor White
}

Clear-Host

$banner = @"

 ┌──────────────────────────────────────────────────────┐ 
 │        Windows Post Install Script by FreeGen        │ 
 │           Настройка стандартного окружения           │ 
 └──────────────────────────────────────────────────────┘ 
"@
Write-Host $banner -ForegroundColor Cyan
Write-Host " ┌──────────────────────────────────────────────────────┐ " -ForegroundColor White
Write-Host " │   Набор программ для развертывания:                  │ " -ForegroundColor White
Write-Host " ├──────────────────────────────────────────────────────┤ " -ForegroundColor White
Write-Host " │ + SetLuma (Управление яркостью монитора)             │ " -ForegroundColor White
Write-Host " │ + Package Installer (Менеджер Chocolatey)            │ " -ForegroundColor White
Write-Host " │ + NanoStat (Клиент для NanoStat Device)              │ " -ForegroundColor White
Write-Host " │ + Windows Package Manager                            │ " -ForegroundColor White
Write-Host " │ + Яндекс Браузер                                     │ " -ForegroundColor White
Write-Host " │ + qBittorrent                                        │ " -ForegroundColor White
Write-Host " │ + Paint.NET                                          │ " -ForegroundColor White
Write-Host " │ + 7-zip                                              │ " -ForegroundColor White
Write-Host " │ + Microsoft VS Code                                  │ " -ForegroundColor White
Write-Host " │ + Microsoft .NET SDK                                 │ " -ForegroundColor White
Write-Host " │ + Python 3.11                                        │ " -ForegroundColor White
Write-Host " │ + K-Lite Codec Pack                                  │ " -ForegroundColor White
Write-Host " └──────────────────────────────────────────────────────┘ " -ForegroundColor White
Write-Host " ┌──────────────────────────────────────────────────────┐ " -ForegroundColor Green
Write-Host " │   Для продолжения установки нажмите любую клавишу    │ " -ForegroundColor Green
Write-Host " └──────────────────────────────────────────────────────┘ " -ForegroundColor Green
Write-Host " ┌──────────────────────────────────────────────────────┐ " -ForegroundColor Red
Write-Host " │   Для отмены установки закройте окно (Ctrl+C)        │ " -ForegroundColor Red
Write-Host " └──────────────────────────────────────────────────────┘ " -ForegroundColor Red

$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
Clear-Host

Write-Host $banner -ForegroundColor Cyan
Write-Host ""

# Динамическая строка статуса
$StatusLine = $host.UI.RawUI.CursorPosition.Y

$InstallPath = "$env:LOCALAPPDATA\FreeGen"
$TempPath = $env:TEMP

function Create-Shortcut {
    param($TargetPath, $ShortcutPath, $Arguments = "")
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut($ShortcutPath)
    $Shortcut.TargetPath = $TargetPath
    $Shortcut.Arguments = $Arguments
    $Shortcut.Save()
}

# Установка из своего источника
function Install-Package {
    param($pkg)

    Set-Status "Скачивание: $($pkg.Name)..."
    $zip = "$TempPath\$($pkg.Name).zip"
    if ($TestMode) {
        Start-Sleep 2
    } else {
        Invoke-WebRequest -Uri $pkg.URL -OutFile $zip -UseBasicParsing -ErrorAction Stop | Out-Null
    }

    Set-Status "Распаковка: $($pkg.Name)..."
    $path = "$InstallPath\$($pkg.Name)"
    New-Item -ItemType Directory -Path $path -Force | Out-Null
    if ($TestMode) {
        Start-Sleep 1
    } else {
        Expand-Archive -Path $zip -DestinationPath $path -Force
    }

    if (-not $TestMode) {
        Remove-Item $zip -Force -ErrorAction SilentlyContinue
    }

    # Создаем автозапуск
    if ($pkg.AutoRun) {
        $args = if ($pkg.LaunchArgs) { $pkg.LaunchArgs } else { "" }
        Create-Shortcut "$path\$($pkg.ExeFile)" "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\$($pkg.Name).lnk" $args
    }

    # Создаем ярлык на рабочем столе
    if ($pkg.DesktopIcon) {
        $args = if ($pkg.LaunchArgs) { $pkg.LaunchArgs } else { "" }
        Create-Shortcut "$path\$($pkg.ExeFile)" "$env:USERPROFILE\Desktop\$($pkg.Name).lnk" $args
    }

    # Запуск программы
    if ($pkg.Launch -and -not $TestMode) {
        if ($pkg.LaunchArgs -and $pkg.LaunchArgs.Trim() -ne "") {
            # Есть аргументы → передаем через -ArgumentList
            Start-Process -FilePath "$path\$($pkg.ExeFile)" -ArgumentList $pkg.LaunchArgs -WorkingDirectory $path
        } else {
            # Нет аргументов → запускаем без -ArgumentList
            Start-Process -FilePath "$path\$($pkg.ExeFile)" -WorkingDirectory $path
        }
    }

    Set-Status "Установлено: $($pkg.Name)"
    Start-Sleep 1
}

# Пакеты из своего источника
$Packages = @(
    @{ Name="SetLuma"; URL="https://free-gen.github.io/downloads/SetLuma.zip"; ExeFile="SetLuma.exe"; AutoRun=$true; Launch=$true; DesktopIcon=$false; LaunchArgs="" },
    @{ Name="Package Installer"; URL="https://free-gen.github.io/downloads/PackageInstaller.zip"; ExeFile="PackageInstaller.exe"; AutoRun=$false; Launch=$false; DesktopIcon=$true; LaunchArgs="" },
    @{ Name="NanoStat"; URL="https://free-gen.github.io/downloads/NanoStat.zip"; ExeFile="NanoStat.exe"; AutoRun=$true; Launch=$true; DesktopIcon=$false; LaunchArgs="--min" }
)

foreach ($p in $Packages) { Install-Package $p }

# Исключение в Защитнике
Set-Status "Настройка Windows Defender..."
Start-Sleep 1
if (-not $TestMode) {
    Add-MpPreference -ExclusionPath $InstallPath -ErrorAction SilentlyContinue | Out-Null
}

# Этап 2 - Winget
Set-Status "Проверка и регистрация Winget..."
Start-Sleep 1
Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe | Out-Null

# Пакеты winget
$wingetApps = @(
    @{Id="Yandex.Browser"; Name="Яндекс Браузер"},
    @{Id="qBittorrent.qBittorrent"; Name="qBittorrent"},
    @{Id="dotPDN.PaintDotNet"; Name="Paint.NET"},
    @{Id="7zip.7zip"; Name="7-Zip"},
    @{Id="Microsoft.VisualStudioCode"; Name="Microsoft VS Code"},
    @{Id="Microsoft.DotNet.SDK.7"; Name="Microsoft .NET SDK"},
    @{Id="Python.Python.3.11"; Name="Python 3.11"},
    @{Id="CodecGuide.K-LiteCodecPack.Mega"; Name="K-Lite Codec Pack"}
)

# Устанвка пакетов winget
foreach ($w in $wingetApps) {
    Set-Status "Установка: $($w.Name)..."
    if ($TestMode) {
        Start-Sleep 2
    } else {
        winget install --id $w.Id -e --silent --disable-interactivity --accept-package-agreements --accept-source-agreements | Out-Null
    }
}

# Устанвка пакетов winget +
# foreach ($w in $wingetApps) {

#     # Проверка наличия
#     $isInstalled = winget list --id $w.Id -e | Select-String $w.Id
#     if ($isInstalled) {
#         Set-Status "Пакет $($w.Name) уже установлен..."
#         continue
#     }

#     # Этап: загрузка + установка
#     Set-Status "Развертывание: $($w.Name)..."

#     if ($TestMode) {
#         Start-Sleep 3
#     } else {
#         winget install --id $w.Id -e --silent --disable-interactivity `
#             --accept-package-agreements --accept-source-agreements | Out-Null
#     }

#     # Завершение
#     Set-Status "Развертывание $($w.Name) завершено..."
# }


# Настройка defaultProfile Windows Terminal
Set-Status "Настройка defaultProfile Windows Terminal..."
Start-Sleep 1
if (Test-Path "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json") {
    if ($TestMode) {
        Start-Sleep 1
    } else {
        try {
            (Get-Content $env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json -Raw | ConvertFrom-Json | ForEach-Object { $_.defaultProfile = "{0caa0dad-35be-5f56-a8ff-afceeeaa6101}"; $_ } | ConvertTo-Json -Depth 5) | Set-Content $env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json -Encoding UTF8
            Set-Status "Windows Terminal - Установлен cmd.exe профиль по умолчанию"
        } catch {
            Set-Status "Ошибка настройки Windows Terminal"
        }
    }
} else {
    Set-Status "Ошибка. Профиль не найден."
}

Set-Status "Все операции успешно выполнены."
Read-Host

