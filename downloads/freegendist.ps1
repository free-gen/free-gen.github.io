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
 │           Установка стандартного окружения           │ 
 └──────────────────────────────────────────────────────┘ 
"@
Write-Host $banner -ForegroundColor Cyan
Write-Host " ┌──────────────────────────────────────────────────────┐ " -ForegroundColor White
Write-Host " │ Будут установлены следующие пакеты программ:         │ " -ForegroundColor White
Write-Host " ├──────────────────────────────────────────────────────┤ " -ForegroundColor White
Write-Host " │ + SetLuma (Управление яркостью монитора)             │ " -ForegroundColor White
Write-Host " │ + Package Installer (Менеджер Chocolatey)            │ " -ForegroundColor White
Write-Host " │ + NanoStat (Клиент для NanoStat Device)              │ " -ForegroundColor White
Write-Host " │ + Windows Package Manager                            │ " -ForegroundColor White
Write-Host " │ + Яндекс Браузер                                     │ " -ForegroundColor White
Write-Host " │ + qBittorrent                                        │ " -ForegroundColor White
Write-Host " │ + Paint.NET                                          │ " -ForegroundColor White
Write-Host " │ + 7zip                                               │ " -ForegroundColor White
Write-Host " │ + Microsoft VSCode                                   │ " -ForegroundColor White
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

function Install-Package {
    param($pkg)

    Set-Status "Скачивание: $($pkg.Name)..."
    $zip = "$TempPath\$($pkg.Name).zip"
    if ($TestMode) {
        Start-Sleep -Milliseconds 2000
    } else {
        Invoke-WebRequest -Uri $pkg.URL -OutFile $zip -UseBasicParsing -ErrorAction Stop | Out-Null
    }

    Set-Status "Распаковка: $($pkg.Name)..."
    $path = "$InstallPath\$($pkg.Name)"
    New-Item -ItemType Directory -Path $path -Force | Out-Null
    if ($TestMode) {
        Start-Sleep -Milliseconds 1000
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

$Packages = @(
    @{ Name="SetLuma"; URL="https://free-gen.github.io/downloads/SetLuma.zip"; ExeFile="SetLuma.exe"; AutoRun=$true; Launch=$true; DesktopIcon=$false; LaunchArgs="" },
    @{ Name="Package Installer"; URL="https://free-gen.github.io/downloads/PackageInstaller.zip"; ExeFile="PackageInstaller.exe"; AutoRun=$false; Launch=$false; DesktopIcon=$true; LaunchArgs="" },
    @{ Name="NanoStat"; URL="https://free-gen.github.io/downloads/NanoStat.zip"; ExeFile="NanoStat.exe"; AutoRun=$true; Launch=$true; DesktopIcon=$false; LaunchArgs="--min" }
)

foreach ($p in $Packages) { Install-Package $p }

Set-Status "Настройка Windows Defender..."
if (-not $TestMode) {
    Add-MpPreference -ExclusionPath $InstallPath -ErrorAction SilentlyContinue | Out-Null
}

Set-Status "Проверка и регистрация Winget..."
Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe | Out-Null

$wingetApps = @(
"Yandex.Browser",
"qBittorrent.qBittorrent",
"dotPDN.PaintDotNet",
"7zip.7zip",
"Microsoft.VisualStudioCode",
"Microsoft.DotNet.SDK.7",
"Python.Python.3.11",
"CodecGuide.K-LiteCodecPack.Mega"
)

foreach ($w in $wingetApps) {
    Set-Status "Установка: $w..."
    if ($TestMode) {
        Start-Sleep -Milliseconds 2000
    } else {
        winget install --id $w -e --silent --disable-interactivity --accept-package-agreements --accept-source-agreements | Out-Null
    }
}

Set-Status "Готово!"
Read-Host
