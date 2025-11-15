$ProgressPreference = 'SilentlyContinue'
$TestMode = $false

# ===== ПЕРЕМЕННЫЕ КОНФИГУРАЦИИ =====
# Пути установки
$InstallPath = "$env:LOCALAPPDATA\FreeGen"
$TempPath = $env:TEMP

# Пакеты для установки из собственного источника
$Packages = @(
    @{ 
        Name = "SetLuma"
        URL = "https://free-gen.github.io/downloads/SetLuma.zip"
        ExeFile = "SetLuma.exe"
        AutoRun = $true
        Launch = $true
        DesktopIcon = $false
        LaunchArgs = ""
    },
    @{ 
        Name = "Package Installer"
        URL = "https://free-gen.github.io/downloads/PackageInstaller.zip"
        ExeFile = "PackageInstaller.exe"
        AutoRun = $false
        Launch = $false
        DesktopIcon = $true
        LaunchArgs = ""
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

# Приложения для установки через Winget
$WingetApps = @(
    # @{ Id = "Yandex.Browser"; Name = "Яндекс Браузер" },
    @{ Id = "qBittorrent.qBittorrent"; Name = "qBittorrent" },
    @{ Id = "dotPDN.PaintDotNet"; Name = "Paint.NET" },
    @{ Id = "7zip.7zip"; Name = "7-Zip" },
    @{ Id = "Microsoft.VisualStudioCode"; Name = "Microsoft VS Code" },
    @{ Id = "Microsoft.DotNet.SDK.7"; Name = "Microsoft .NET SDK" },
    @{ Id = "Python.Python.3.11"; Name = "Python 3.11" },
    @{ Id = "CodecGuide.K-LiteCodecPack.Mega"; Name = "K-Lite Codec Pack" }
)

# ===== БАННЕРЫ И ИНТЕРФЕЙС =====
$Banner = @"

 ┌──────────────────────────────────────────────────────┐ 
 │        Windows Post Install Script by FreeGen        │ 
 │           Настройка стандартного окружения           │ 
 └──────────────────────────────────────────────────────┘ 
"@

$SoftwareList = @"
 ┌──────────────────────────────────────────────────────┐ 
 │   Набор программ для развертывания:                  │ 
 ├──────────────────────────────────────────────────────┤ 
 │   Пакеты из источника FreeGen:                       │ 
 │ + SetLuma (Управление яркостью монитора)             │ 
 │ + Package Installer (Менеджер Chocolatey)            │ 
 │ + NanoStat (Клиент для NanoStat Device)              │ 
 │                                                      │ 
 │   Пакеты Windows Package Manager:                    │ 
 │ + qBittorrent                                        │ 
 │ + Paint.NET                                          │ 
 │ + 7-zip                                              │ 
 │ + Microsoft VS Code                                  │ 
 │ + Microsoft .NET SDK                                 │ 
 │ + Python 3.11                                        │ 
 │ + K-Lite Codec Pack                                  │ 
 └──────────────────────────────────────────────────────┘ 
"@

$ContinuePrompt = @"
 ┌──────────────────────────────────────────────────────┐ 
 │   Для продолжения установки нажмите любую клавишу    │ 
 └──────────────────────────────────────────────────────┘ 
"@

$CancelInfo = @"
 ┌──────────────────────────────────────────────────────┐ 
 │   Для отмены установки закройте окно (Ctrl+C)        │ 
 └──────────────────────────────────────────────────────┘ 
"@

# ===== ФУНКЦИИ =====

# Функция для обновления строки статуса
function Set-Status {
    param([string]$Text)
    
    # Сохраняем текущую позицию курсора
    $currentPosition = $host.UI.RawUI.CursorPosition
    $currentPosition.Y = $StatusLine
    $host.UI.RawUI.CursorPosition = $currentPosition
    
    # Очищаем строку
    Write-Host (" " * ($host.UI.RawUI.WindowSize.Width)) -NoNewline
    $host.UI.RawUI.CursorPosition = $currentPosition

    # Выводим новый статус
    Write-Host ("   " + $Text) -ForegroundColor White
}

# Функция создания ярлыков
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
    
    if ($Arguments -ne "") {
        $Shortcut.Arguments = $Arguments
    }

    # ГЛАВНОЕ ДОБАВЛЕНИЕ
    if ($WorkingDirectory -eq "") {
        $Shortcut.WorkingDirectory = Split-Path $TargetPath
    } else {
        $Shortcut.WorkingDirectory = $WorkingDirectory
    }

    $Shortcut.Save()
}

# Функция установки пакетов из собственного источника
function Install-Package {
    param($Package)
    
    $packagePath = "$InstallPath\$($Package.Name)"

    # Проверяем, не установлен ли пакет уже
    if (Test-Path $packagePath) {
        Set-Status "$($Package.Name) уже установлено."
        Start-Sleep 1
        return
    }

    # Скачивание пакета
    Set-Status "Скачивание: $($Package.Name)..."
    Start-Sleep 2
    $zipFile = "$TempPath\$($Package.Name).zip"
    
    if ($TestMode) {
        Start-Sleep 2
    } else {
        Invoke-WebRequest -Uri $Package.URL -OutFile $zipFile -UseBasicParsing -ErrorAction Stop | Out-Null
    }

    # Распаковка
    Set-Status "Распаковка: $($Package.Name)..."
    Start-Sleep 2
    New-Item -ItemType Directory -Path $packagePath -Force | Out-Null
    
    if ($TestMode) {
        Start-Sleep 2
    } else {
        Expand-Archive -Path $zipFile -DestinationPath $packagePath -Force
        Remove-Item $zipFile -Force -ErrorAction SilentlyContinue
    }

    # Создание автозапуска
    # if ($Package.AutoRun) {
    #     $arguments = if ($Package.LaunchArgs) { $Package.LaunchArgs } else { "" }
    #     Create-Shortcut `
    #         -TargetPath "$packagePath\$($Package.ExeFile)" `
    #         -ShortcutPath "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\$($Package.Name).lnk" `
    #         -Arguments $arguments
    # }

    # Создание автозапуска через Планировщик задач
    if ($Package.AutoRun) {
        $taskName = $Package.Name
        $exePath  = "$packagePath\$($Package.ExeFile)"
        $arguments = $Package.LaunchArgs

        # Удаляем старое задание, если есть
        schtasks.exe /Delete /TN "$taskName" /F 2>$null | Out-Null

        # Формируем команду запуска для /TR
        if ($arguments -and $arguments.Trim() -ne "") {
            $taskCommand = "`"$exePath`" $arguments"
        } else {
            $taskCommand = "`"$exePath`""
        }

        # Создаём новое задание
        schtasks.exe /Create `
            /SC ONLOGON `
            /RL HIGHEST `
            /TN "$taskName" `
            /TR "$taskCommand" `
            /F | Out-Null
    }

    # Создание ярлыка на рабочем столе
    if ($Package.DesktopIcon) {
        $arguments = if ($Package.LaunchArgs) { $Package.LaunchArgs } else { "" }
        Create-Shortcut `
            -TargetPath "$packagePath\$($Package.ExeFile)" `
            -ShortcutPath "$env:USERPROFILE\Desktop\$($Package.Name).lnk" `
            -Arguments $arguments
    }

    # Запуск программы
    if ($Package.Launch -and -not $TestMode) {
        $processParams = @{
            FilePath = "$packagePath\$($Package.ExeFile)"
            WorkingDirectory = $packagePath
        }
        
        if ($Package.LaunchArgs -and $Package.LaunchArgs.Trim() -ne "") {
            $processParams.ArgumentList = $Package.LaunchArgs
        }
        
        Start-Process @processParams
    }

    Set-Status "Установлено: $($Package.Name)"
    Start-Sleep 2
}

# ===== ОСНОВНОЙ КОД =====

# Очистка экрана и отображение интерфейса
Clear-Host

Write-Host $Banner -ForegroundColor Cyan
Write-Host $SoftwareList -ForegroundColor White
Write-Host $ContinuePrompt -ForegroundColor Green
Write-Host $CancelInfo -ForegroundColor Red

# Ожидание нажатия клавиши
$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
Clear-Host

# Повторный вывод баннера после очистки
Write-Host $Banner -ForegroundColor Cyan
Write-Host ""

# Установка позиции строки статуса
$StatusLine = $host.UI.RawUI.CursorPosition.Y

# ===== УСТАНОВКА ПАКЕТОВ ИЗ СОБСТВЕННОГО ИСТОЧНИКА =====
foreach ($package in $Packages) {
    Install-Package -Package $package
}

# ===== НАСТРОЙКА WINDOWS DEFENDER =====
Set-Status "Настройка Windows Defender..."
Start-Sleep 2
if (-not $TestMode) {
    Add-MpPreference -ExclusionPath $InstallPath -ErrorAction SilentlyContinue | Out-Null
}

# ===== УСТАНОВКА ПРИЛОЖЕНИЙ ЧЕРЕЗ WINGET =====
foreach ($app in $WingetApps) {

    Set-Status "Развертывание: $($app.Name)..."
    Start-Sleep 1

    if ($TestMode) {
        Start-Sleep 3
    } else {
        winget install --id $app.Id -e --silent --disable-interactivity `
            --accept-package-agreements --accept-source-agreements | Out-Null
    }

    Set-Status "Развертывание $($app.Name) завершено..."
    Start-Sleep 1
}

# ===== НАСТРОЙКА WINDOWS TERMINAL =====
Set-Status "Настройка defaultProfile Windows Terminal..."
Start-Sleep 2

$terminalSettingsPath = "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json"

if (Test-Path $terminalSettingsPath) {
    if ($TestMode) {
        Start-Sleep 2
    } else {
        try {
            # Чтение и обновление настроек терминала
            $settings = Get-Content $terminalSettingsPath -Raw | ConvertFrom-Json
            $settings.defaultProfile = "{0caa0dad-35be-5f56-a8ff-afceeeaa6101}"
            
            # Сохранение обновленных настроек
            $settings | ConvertTo-Json -Depth 5 | Set-Content $terminalSettingsPath -Encoding UTF8
            
            Set-Status "Windows Terminal - Установлен cmd.exe профиль по умолчанию"
            Start-Sleep 3
        } catch {
            Set-Status "Ошибка настройки Windows Terminal"
            Start-Sleep 3
        }
    }
} else {
    Set-Status "Ошибка. Профиль не найден."
    Start-Sleep 3
}

# ===== ЗАВЕРШЕНИЕ =====
Set-Status "Все операции успешно выполнены."
Read-Host
