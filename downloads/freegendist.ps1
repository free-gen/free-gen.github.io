# freegendist.ps1 - ОБЁРТКА для рабочего CMD кода
$cmdCode = @'
@echo off
chcp 65001 >nul
echo FreeGen Dist

echo Установка SetLuma...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/free-gen/SetLuma/releases/download/1.0/SetLuma.zip' -OutFile \"%TEMP%\SetLuma.zip\""
mkdir "%LOCALAPPDATA%\FreeGen\SetLuma" 2>nul
tar -xf "%TEMP%\SetLuma.zip" -C "%LOCALAPPDATA%\FreeGen\SetLuma"
del "%TEMP%\SetLuma.zip"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([System.IO.Path]::Combine($env:APPDATA, 'Microsoft\Windows\Start Menu\Programs\Startup', 'SetLuma.lnk')); $Shortcut.TargetPath = '%LOCALAPPDATA%\FreeGen\SetLuma\SetLuma.exe'; $Shortcut.WorkingDirectory = '%LOCALAPPDATA%\FreeGen\SetLuma'; $Shortcut.Save()"
cd /d "%LOCALAPPDATA%\FreeGen\SetLuma"
start "" "SetLuma.exe"
cd /d "%~dp0"

echo Установка Package Installer...
powershell -Command "Invoke-WebRequest -Uri 'https://free-gen.github.io/downloads/PackageInstaller.zip' -OutFile \"%TEMP%\PackageInstaller.zip\""
mkdir "%LOCALAPPDATA%\FreeGen\PackageInstaller" 2>nul
tar -xf "%TEMP%\PackageInstaller.zip" -C "%LOCALAPPDATA%\FreeGen\PackageInstaller"
del "%TEMP%\PackageInstaller.zip"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([System.IO.Path]::Combine($env:UserProfile, 'Desktop', 'Package Installer.lnk')); $Shortcut.TargetPath = '%LOCALAPPDATA%\FreeGen\PackageInstaller\PackageInstaller.exe'; $Shortcut.WorkingDirectory = '%LOCALAPPDATA%\FreeGen\PackageInstaller'; $Shortcut.Save()"

echo Установка NanoStat...
powershell -Command "Invoke-WebRequest -Uri 'https://free-gen.github.io/downloads/NanoStat.zip' -OutFile \"%TEMP%\NanoStat.zip\""
mkdir "%LOCALAPPDATA%\FreeGen\NanoStat" 2>nul
tar -xf "%TEMP%\NanoStat.zip" -C "%LOCALAPPDATA%\FreeGen\NanoStat"
del "%TEMP%\NanoStat.zip"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $StartupPath = [System.IO.Path]::Combine($env:APPDATA, 'Microsoft\Windows\Start Menu\Programs\Startup', 'NanoStat.lnk'); $Shortcut = $WshShell.CreateShortcut($StartupPath); $Shortcut.TargetPath = '%LOCALAPPDATA%\FreeGen\NanoStat\NanoStat.exe'; $Shortcut.Arguments = '--min'; $Shortcut.WorkingDirectory = '%LOCALAPPDATA%\FreeGen\NanoStat'; $Shortcut.Save()"
cd /d "%LOCALAPPDATA%\FreeGen\NanoStat"
start "" "NanoStat.exe" --min
cd /d "%~dp0"

echo Добавление в исключения Защитника Windows...
powershell -Command "Add-MpPreference -ExclusionPath '%LOCALAPPDATA%\FreeGen'"

echo.
echo Установка завершена!
echo Все программы установлены в: %LOCALAPPDATA%\FreeGen
pause
'@

# Сохраняем CMD код во временный файл и запускаем
$cmdFile = "$env:TEMP\freegen_install.cmd"
$cmdCode | Out-File -FilePath $cmdFile -Encoding ASCII
Start-Process -FilePath "cmd.exe" -ArgumentList "/c $cmdFile" -Wait
Remove-Item $cmdFile -Force
