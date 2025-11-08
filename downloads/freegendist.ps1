# FreeGen Distribution Installer
Write-Host "=== FreeGen Installer ===" -ForegroundColor Cyan

# Пути
$InstallPath = "$env:LOCALAPPDATA\FreeGen"
$TempPath = $env:TEMP

# Определение пакетов
$Packages = @(
    @{
        Name = "SetLuma"
        URL = "https://free-gen.github.io/downloads/SetLuma.zip"
        ExeFile = "SetLuma.exe"
        AutoRun = $true
        Launch = $true
        DesktopIcon = $false
        LaunchArgs = $null
    },
    @{
        Name = "Package Installer"
        URL = "https://free-gen.github.io/downloads/PackageInstaller.zip"
        ExeFile = "PackageInstaller.exe"
        AutoRun = $false
        Launch = $false
        DesktopIcon = $true
        LaunchArgs = $null
    },
    @{
        Name = "NanoStat"
        URL = "https://free-gen.github.io/downloads/NanoStat.zip"
        ExeFile = "NanoStat.exe"
        AutoRun = $true
        Launch = $true
        DesktopIcon = $false
        LaunchArgs = "--min"
    }
)

# Функция установки пакета
function Install-Package {
    param($Package)
    
    Write-Host "Установка $($Package.Name)..." -ForegroundColor Yellow
    
    # Скачивание
    $zipFile = "$TempPath\$($Package.Name).zip"
    try {
        Invoke-WebRequest -Uri $Package.URL -OutFile $zipFile
        Write-Host "  ✓ Скачано" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Ошибка скачивания: $($_.Exception.Message)" -ForegroundColor Red
        return
    }
    
    # Создание папки
    $packagePath = "$InstallPath\$($Package.Name)"
    New-Item -ItemType Directory -Path $packagePath -Force | Out-Null
    
    # Распаковка
    try {
        Expand-Archive -Path $zipFile -DestinationPath $packagePath -Force
        Write-Host "  ✓ Распаковано" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Ошибка распаковки, пробуем через tar..." -ForegroundColor Yellow
        try {
            & tar -xf $zipFile -C $packagePath
            Write-Host "  ✓ Распаковано через tar" -ForegroundColor Green
        } catch {
            Write-Host "  ✗ Ошибка распаковки tar: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    # Удаление архива
    Remove-Item $zipFile -Force -ErrorAction SilentlyContinue
    
    # Ярлык в автозагрузку
    if ($Package.AutoRun) {
        $startupPath = [System.IO.Path]::Combine($env:APPDATA, "Microsoft\Windows\Start Menu\Programs\Startup", "$($Package.Name).lnk")
        Create-Shortcut -TargetPath "$packagePath\$($Package.ExeFile)" -ShortcutPath $startupPath -Arguments $Package.LaunchArgs
        Write-Host "  ✓ Ярлык в автозагрузке" -ForegroundColor Green
    }
    
    # Ярлык на рабочий стол
    if ($Package.DesktopIcon) {
        $desktopPath = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop", "$($Package.Name).lnk")
        Create-Shortcut -TargetPath "$packagePath\$($Package.ExeFile)" -ShortcutPath $desktopPath
        Write-Host "  ✓ Ярлык на рабочем столе" -ForegroundColor Green
    }
    
    # Запуск приложения
    if ($Package.Launch) {
        $exePath = "$packagePath\$($Package.ExeFile)"
        if (Test-Path $exePath) {
            if ($Package.LaunchArgs) {
                Start-Process -FilePath $exePath -ArgumentList $Package.LaunchArgs -WorkingDirectory $packagePath
            } else {
                Start-Process -FilePath $exePath -WorkingDirectory $packagePath
            }
            Write-Host "  ✓ Приложение запущено" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Исполняемый файл не найден" -ForegroundColor Yellow
        }
    }
}

# Функция создания ярлыка
function Create-Shortcut {
    param(
        [string]$TargetPath,
        [string]$ShortcutPath,
        [string]$Arguments = "",
        [string]$WorkingDirectory = ""
    )
    
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut($ShortcutPath)
    $Shortcut.TargetPath = $TargetPath
    $Shortcut.Arguments = $Arguments
    $Shortcut.WorkingDirectory = if ($WorkingDirectory) { $WorkingDirectory } else { [System.IO.Path]::GetDirectoryName($TargetPath) }
    $Shortcut.Save()
}

# Основной процесс установки
Write-Host "Установка в: $InstallPath" -ForegroundColor Gray

# Установка каждого пакета
foreach ($package in $Packages) {
    Install-Package -Package $package
    Write-Host ""
}

# Добавление в исключения Защитника Windows
Write-Host "Добавление в исключения Защитника Windows..." -ForegroundColor Yellow
try {
    Add-MpPreference -ExclusionPath $InstallPath -ErrorAction Stop
    Write-Host "✓ Папка добавлена в исключения" -ForegroundColor Green
} catch {
    Write-Host "⚠ Не удалось добавить в исключения (требуются права администратора)" -ForegroundColor Yellow
}

Write-Host "`nУстановка завершена!" -ForegroundColor Green
Write-Host "Все программы установлены в: $InstallPath" -ForegroundColor Gray
Write-Host "`nДля продолжения нажмите клавишу ВВОД..." -ForegroundColor Yellow
Read-Host


