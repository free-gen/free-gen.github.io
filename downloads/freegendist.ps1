# Функция для выполнения команд с проверкой ошибок
function Execute-Step {
    param([string]$StepName, [scriptblock]$Action)
    Write-Host "Выполняется: $StepName" -ForegroundColor Yellow
    try {
        & $Action
        Write-Host "✓ $StepName завершено успешно" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Ошибка в $StepName : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Создание основной папки FreeGen
$FreeGenPath = "$env:LOCALAPPDATA\FreeGen"
if (!(Test-Path $FreeGenPath)) {
    mkdir $FreeGenPath -Force
}

# 1. Установка SetLuma
Execute-Step "Установка SetLuma" {
    $tempFile = "$env:TEMP\SetLuma.zip"
    
    # Скачивание
    Invoke-WebRequest -Uri 'https://github.com/free-gen/SetLuma/releases/download/1.0/SetLuma.zip' -OutFile $tempFile
    
    # Создание папки и распаковка
    $installPath = "$FreeGenPath\SetLuma"
    if (Test-Path $installPath) { Remove-Item $installPath -Recurse -Force }
    mkdir $installPath -Force
    
    # Распаковка
    Expand-Archive -Path $tempFile -DestinationPath $installPath -Force
    
    # Удаление временного файла
    Remove-Item $tempFile -Force
    
    # Создание ярлыка в автозагрузке
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\SetLuma.lnk")
    $Shortcut.TargetPath = "$installPath\SetLuma.exe"
    $Shortcut.WorkingDirectory = $installPath
    $Shortcut.Save()
    
    # Запуск приложения
    Start-Process -FilePath "$installPath\SetLuma.exe" -WorkingDirectory $installPath
}

# 2. Установка Package Installer
Execute-Step "Установка Package Installer" {
    $tempFile = "$env:TEMP\PackageInstaller.zip"
    
    # Скачивание
    Invoke-WebRequest -Uri 'https://free-gen.github.io/downloads/PackageInstaller.zip' -OutFile $tempFile
    
    # Создание папки и распаковка
    $installPath = "$FreeGenPath\PackageInstaller"
    if (Test-Path $installPath) { Remove-Item $installPath -Recurse -Force }
    mkdir $installPath -Force
    
    # Распаковка
    Expand-Archive -Path $tempFile -DestinationPath $installPath -Force
    
    # Удаление временного файла
    Remove-Item $tempFile -Force
    
    # Создание ярлыка на рабочем столе
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Package Installer.lnk")
    $Shortcut.TargetPath = "$installPath\PackageInstaller.exe"
    $Shortcut.WorkingDirectory = $installPath
    $Shortcut.Save()
}

# 3. Установка NanoStat App
Execute-Step "Установка NanoStat" {
    $tempFile = "$env:TEMP\NanoStat.zip"
    
    # Скачивание
    Invoke-WebRequest -Uri 'https://free-gen.github.io/downloads/NanoStat.zip' -OutFile $tempFile
    
    # Создание папки и распаковка
    $installPath = "$FreeGenPath\NanoStat"
    if (Test-Path $installPath) { Remove-Item $installPath -Recurse -Force }
    mkdir $installPath -Force
    
    # Распаковка
    Expand-Archive -Path $tempFile -DestinationPath $installPath -Force
    
    # Удаление временного файла
    Remove-Item $tempFile -Force
    
    # Создание ярлыка в автозагрузке
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\NanoStat.lnk")
    $Shortcut.TargetPath = "$installPath\NanoStat.exe"
    $Shortcut.Arguments = "--min"
    $Shortcut.WorkingDirectory = $installPath
    $Shortcut.Save()
    
    # Запуск приложения
    Start-Process -FilePath "$installPath\NanoStat.exe" -ArgumentList "--min" -WorkingDirectory $installPath
}

# 4. Добавление в исключения Защитника Windows
Execute-Step "Добавление в исключения Защитника Windows" {
    Add-MpPreference -ExclusionPath $FreeGenPath
}

Write-Host "`nУстановка завершена!" -ForegroundColor Green
Write-Host "Все программы установлены в: $FreeGenPath" -ForegroundColor Cyan
pause
